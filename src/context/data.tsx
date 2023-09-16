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

const firstItem: itemI = {
  title: "Title",
  key: "RootPage",
  display: "",
  text: "",
};

const tutorial: dataI = {
  RootPage: {
    title: "Main page",
    key: "RootPage",
    display: "",
    text: "Welcome to the Game Master Notebook companion!<br><br>\nThis is the starting page of your notebook, use it as base for the rest of your notes.<br><br>This is a [note], notes appear in the right column and show you some information about themselfs.<br><br>\nYou can [modPage] of any page by enabling edit-mode. Just lick on the top-right pencil icon!.<br><br>\nIn order to create a note, just wrap a word between brackets [], and the note will appear the the right.<br><br>Pages have three [pageAttr]: a title (the title of the page), display (the text that will be displayed when used as reference in another note) and body!<br><br>Use the right-bottom buttons to upload (top), download (middle) or reset (bottom) your current notebook.\n",
  },
  nota: { title: "nota", text: "", display: "nota", key: "nota" },
  note: {
    title: "I am a note!",
    text: "This is some useful information about me, if you click on my book icon you will visit my page, and will be able to modify my content.",
    display: "note",
    key: "note",
  },
  modPage: {
    title: "Modify Page Information",
    text: "Enable the edit-mode by clicking on the top-right pencil icon!",
    display: "modify page information",
    key: "modPage",
  },
  pageAttr: {
    title: "Page attributes",
    text: "Title: The title of the page.<br>\nDisplay: The text that is shown when included in the content of another note.<br>\nBody: The content of the note.",
    display: "page attributes",
    key: "pageAttr",
  },
};

export const DataContext = createContext<contextOutputI>({
  data: {},
  item: firstItem,
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
  const [data, setData] = useState<dataI>(tutorial);
  const [textPieces, setTextPieces] = useState<textPieceI[]>([]);
  const [item, setItem] = useState<string>("RootPage");

  const updateData = (value: dataI, resetEntry: boolean = true) => {
    setData({});
    setTimeout(() => {
      setData(value);
      if (resetEntry) getBaseEntry(value);
    }, 0);
    saveToLocalStorage(value);
  };

  const resetData = () => {
    setData({});
    setTimeout(() => {
      setData({
        RootPage: firstItem,
      });
    }, 0);
    setItem("RootPage");
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
      setData({});
      setTimeout(() => {
        setData(parsed);
        getBaseEntry(parsed);
      }, 0);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (!data?.RootPage) {
      setData(tutorial);
      setItem("RootPage");
      return;
    }
    if (!data?.[item]) {
      setItem("RootPage");
      return;
    }
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
        item: data[item] || firstItem,
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
