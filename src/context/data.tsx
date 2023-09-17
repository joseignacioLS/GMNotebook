import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getTextReferences, splitTextIntoReferences } from "@/utils/text";
import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { dataI, firstItem, itemI, textPieceI, tutorial } from "./constants";
import { NavigationContext } from "./navigation";

interface contextOutputI {
  data: dataI;
  item: itemI;
  textPieces: textPieceI[];
  updateTextPieces: (cb: (value: textPieceI[]) => textPieceI[]) => void;
  updateData: (value: dataI, reset: boolean) => void;
  addNewEntry: (item: itemI) => void;
  replaceReferencesByDisplay: any;
  includeRerencesInText: any;
  resetData: () => void;
  selectedNote: string | undefined;
  setSelectedNote: any;
}

export const DataContext = createContext<contextOutputI>({
  data: {},
  item: tutorial["RootPage"],
  textPieces: [],
  updateTextPieces: (cb: (value: textPieceI[]) => {}) => {},
  updateData: (value: dataI, reset: boolean) => {},
  addNewEntry: (item: itemI) => {},
  replaceReferencesByDisplay: () => {},
  includeRerencesInText: () => {},
  resetData: () => {},
  selectedNote: "",
  setSelectedNote: () => {},
});

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [data, setData] = useState<dataI>(tutorial);
  const [textPieces, setTextPieces] = useState<textPieceI[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | undefined>(
    undefined
  );

  const { path, resetPath, getCurrentPage } = useContext(NavigationContext);

  const removeEmptyPages = (value: dataI) => {
    const deletedKeys: string[] = [];
    Object.keys(value).forEach((key: string) => {
      if (value[key].text === "" && key !== "RootPage") {
        delete value[key];
        deletedKeys.push(key);
      }
    });

    if (deletedKeys.length > 0) {
      resetPath();
    }

    Object.keys(value).forEach((key: string) => {
      deletedKeys.forEach((deletedKey: string) => {
        value[key].text = value[key].text.replace(
          new RegExp(`\\[${deletedKey}\\]`, "g"),
          deletedKey
        );
      });
    });
    return value;
  };

  const updateData = (value: dataI, resetEntry: boolean = true) => {
    value = removeEmptyPages(value);
    setTimeout(() => {
      setData(value);
      if (resetEntry) resetPath();
      saveToLocalStorage(value);
    }, 0);
  };

  const resetData = () => {
    updateData({ ...tutorial }, true);
  };

  const addNewEntry = (item: itemI) => {
    setData({});
    setTimeout(() => {
      setData((oldValue) => {
        return { ...oldValue, item };
      });
    }, 0);
  };

  const replaceReferencesByDisplay = (text: string) => {
    text = includeRerencesInText(text);
    Object.keys(data).forEach((key: string) => {
      text = text.replace(new RegExp(`\\[${key}\\]`, "g"), data[key].display);
    });
    return text.split("<br>").map((item: string, i: number) => (
      <span key={i}>
        {item}
        <br />
      </span>
    ));
  };

  const includeRerencesInText = (text: string, excludeRefs: string[] = []) => {
    Object.keys(data).forEach((key: string) => {
      if (excludeRefs.includes(key)) return;
      const regex = new RegExp(`(^|[ ])(${key})([ \.,\-])`, "g");
      text = text?.replace(regex, `$1[$2]$3`) || "";
    });
    return text;
  };

  useEffect(() => {
    if (data?.RootPage === undefined) {
      updateData(tutorial);
      return;
    }
    const currentPage = getCurrentPage();
    if (!data?.[currentPage]) {
      resetPath();
      return;
    }
    const referenceText = data[currentPage].text;
    const references = getTextReferences(referenceText);
    if (!references) return setTextPieces([]);
    const refes = splitTextIntoReferences(references, referenceText);
    setTextPieces(refes);
  }, [path, data]);

  useEffect(() => {
    const retrieved = retrieveLocalStorage();
    try {
      const parsed = JSON.parse(retrieved) as dataI;
      updateData(parsed);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        item: data[getCurrentPage()] || { ...tutorial },
        textPieces,
        updateTextPieces: setTextPieces,
        updateData,
        addNewEntry,
        replaceReferencesByDisplay,
        includeRerencesInText,
        resetData,
        selectedNote,
        setSelectedNote,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
