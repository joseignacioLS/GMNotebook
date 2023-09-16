import { getTextReferences, splitTextIntoReferences } from "@/utils/text";
import { ReactElement, createContext, useEffect, useState } from "react";

export interface itemI {
  title: string;
  text: string;
  key: string;
  display: string;
  baseEntry?: string;
}

export interface textPieceI {
  content: string;
  key?: string;
  visible?: boolean;
  color?: string;
  id?: string;
}

interface contextOutputI {
  data: dataI;
  item: itemI;
  textPieces: textPieceI[];
  updateTextPieces: (cb: (value: textPieceI[]) => textPieceI[]) => void;
  updateData: (value: dataI, reset: boolean) => void;
  addNewEntry: (item: itemI) => void;
  updateItem: (key: string) => void;
  replaceReferencesByDisplay: any;
  includeRerencesInText: any;
  resetData: () => void;
}
export interface dataI {
  [key: string]: itemI;
}

const emptyItem: itemI = {
  title: "Titulo de prueba",
  key: "Key de prueba",
  display: "Display de prueba",
  text: "Texto de prueba Adrian.",
};

export const DataContext = createContext<contextOutputI>({
  data: {},
  item: emptyItem,
  textPieces: [],
  updateTextPieces: (cb: (value: textPieceI[]) => {}) => {},
  updateData: (value: dataI, reset: boolean) => {},
  addNewEntry: (item: itemI) => {},
  updateItem: (key: string) => {},
  replaceReferencesByDisplay: () => {},
  includeRerencesInText: () => {},
  resetData: () => {},
});

const saveToLocalStorage = (value: dataI) => {
  window.localStorage.setItem("data", JSON.stringify(value));
};

const retrieveLocalStorage = () => {
  return window.localStorage.getItem("data") || "{}";
};

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [data, setData] = useState<dataI>({});
  const [textPieces, setTextPieces] = useState<textPieceI[]>([]);
  const [item, setItem] = useState<string>("");

  const updateData = (value: dataI, resetEntry: boolean = true) => {
    setData({});
    setTimeout(() => {
      setData(value);
      if (resetEntry) getBaseEntry(value);
    }, 0);
    saveToLocalStorage(value);
  };

  const resetData = () => {
    // setData({
    //   RootPage: {
    //     title: "RootPage",
    //     text: "",
    //     display: "root",
    //     key: "RootPage",
    //     baseEntry: "1",
    //   },
    // });
    setData({
      RootPage: {
        title: "Title",
        key: "RootPage",
        display: "displayKey",
        text: "Text",
        baseEntry: "1",
      },
    });
    setItem("RootPage");
  };

  const addNewEntry = (item: itemI) => {
    setData((oldValue) => {
      return { ...oldValue, item };
    });
  };

  const replaceReferencesByDisplay = (text: string) => {
    text = includeRerencesInText(text);
    Object.keys(data).forEach((key: string) => {
      text = text.replace(new RegExp(`\\[${key}\\]`, "g"), data[key].display);
    });
    text = text.replace(/<br>/g, " ");
    return text;
  };

  const includeRerencesInText = (text: string, excludeRefs: string[] = []) => {
    Object.keys(data).forEach((key: string) => {
      if (excludeRefs.includes(key)) return;
      const regex = new RegExp(`(^|[ ])(${key})([ \.,\-])`, "g");
      text = text?.replace(regex, `$1[$2]$3`) || "";
    });
    return text;
  };

  const getBaseEntry = (data: dataI) => {
    setItem(
      Object.keys(data).find((key: string) => {
        return data[key].baseEntry === "1";
      }) || ""
    );
  };

  useEffect(() => {
    const retrieved = retrieveLocalStorage();
    try {
      const parsed = JSON.parse(retrieved) as dataI;
      console.log(parsed);
      setData(parsed);
      getBaseEntry(parsed);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (!data?.[item]) return;
    const referenceText = data[item].text;
    const references = getTextReferences(referenceText);
    if (!references) return setTextPieces([]);
    const refes = splitTextIntoReferences(references, referenceText);
    setTextPieces(refes);
  }, [item, data]);

  return (
    <DataContext.Provider
      value={{
        data,
        item: data[item] || emptyItem,
        textPieces,
        updateTextPieces: setTextPieces,
        updateData,
        addNewEntry,
        updateItem: setItem,
        replaceReferencesByDisplay,
        includeRerencesInText,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
