import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getTextReferences, splitTextIntoReferences } from "@/utils/text";
import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { dataI, itemI, textPieceI, tutorial } from "./constants";
import { NavigationContext } from "./navigation";

interface contextOutputI {
  data: dataI;
  item: itemI;
  editMode: boolean;
  setEditMode: any;
  textPieces: textPieceI[];
  updateTextPieces: (cb: (value: textPieceI[]) => textPieceI[]) => void;
  updateData: (value: dataI, reset: boolean) => void;
  addNewEntry: (item: itemI) => void;
  replaceReferencesByDisplay: any;
  resetData: () => void;
  selectedNote: string | undefined;
  setSelectedNote: any;
  generateDisplayText: any;
}

export const DataContext = createContext<contextOutputI>({
  data: {},
  item: tutorial["RootPage"],
  editMode: false,
  setEditMode: () => {},
  textPieces: [],
  updateTextPieces: (cb: (value: textPieceI[]) => {}) => {},
  updateData: (value: dataI, reset: boolean) => {},
  addNewEntry: (item: itemI) => {},
  replaceReferencesByDisplay: () => {},

  resetData: () => {},
  selectedNote: "",
  setSelectedNote: () => {},
  generateDisplayText: () => {},
});

const updateSelectedNote = (key: string) => {
  setTimeout(() => {
    document.querySelector(`#detail-${key}`)?.scrollIntoView();
    // add animation to card
    document.querySelector(`#detail-${key}`)?.classList.add("flash");
    setTimeout(() => {
      document.querySelector(`#detail-${key}`)?.classList.remove("flash");
    }, 600);
  }, 0);
};

const checkItemVisibility = (id: string) => {
  const boundingRect = document
    .querySelector(`#${id}`)
    ?.getBoundingClientRect();
  if (!boundingRect) return false;
  const notesContainer = document.querySelector("#notes") as any;
  const titleSpace = 80;
  return (
    boundingRect.top >= titleSpace &&
    boundingRect.top <= (notesContainer?.offsetHeight || 0) + titleSpace
  );
};

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [data, setData] = useState<dataI>(tutorial);
  const [editMode, setEditMode] = useState<boolean>(false);
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
          new RegExp(`note\:${deletedKey}`, "g"),
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

  const generateDisplayText = (text: textPieceI[], referenceStyle: string) => {
    const chuncks: ReactElement[] = text.map((ele, i) => {
      if (ele.type === "reference") {
        if (!ele.key) return <></>;
        const content = data[ele.key]?.display || "";
        return (
          <span
            key={i}
            id={ele.id}
            className={`${referenceStyle}`}
            style={{ backgroundColor: ele.color }}
            onClick={() => updateSelectedNote(ele?.key || "")}
          >
            {content}
          </span>
        );
      } else if (ele.type === "text") {
        return <span key={i}>{ele.content}</span>;
      } else if (ele.type === "break") {
        return <br key={i} />;
      } else if (ele.type === "image") {
        return <img key={i} src={ele.content.split("img:")[1]} />;
      }
      return <></>;
    });
    return chuncks;
  };

  const replaceReferencesByDisplay = (text: string) => {
    Object.keys(data).forEach((key: string) => {
      const regex = new RegExp(`note\:${key}`, "g");
      text = text.replace(regex, data[key].display);
    });
    return text.split("<br>").map((item: string, i: number) => (
      <span key={i}>
        {item}
        <br />
      </span>
    ));
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
    const refes = splitTextIntoReferences(referenceText);
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

  const updateVisibleReferences = () => {
    let visibleIndex = 0;
    setTextPieces((oldValue: textPieceI[]) => {
      return oldValue.map((ref: textPieceI) => {
        if (ref.type !== "reference") return ref;
        visibleIndex += 1;
        const visible = checkItemVisibility(ref?.id || "");
        const newRef = {
          ...ref,
          visible,
        } as textPieceI;
        return newRef;
      }) as textPieceI[];
    });
  };

  useEffect(() => {
    document
      .querySelector("#notes")
      ?.addEventListener("scroll", updateVisibleReferences);
    return () =>
      document
        .querySelector("#notes")
        ?.removeEventListener("scroll", updateVisibleReferences);
  }, [textPieces, updateVisibleReferences, editMode]);

  useEffect(() => {
    updateVisibleReferences();
  }, [editMode]);

  return (
    <DataContext.Provider
      value={{
        data,
        item: data[getCurrentPage()] || { ...tutorial },
        textPieces,
        editMode,
        setEditMode,
        updateTextPieces: setTextPieces,
        updateData,
        addNewEntry,
        replaceReferencesByDisplay,
        resetData,
        selectedNote,
        setSelectedNote,
        generateDisplayText,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
