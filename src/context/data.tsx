import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { extractReferences, removeReferences } from "@/utils/text";
import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { dataI, itemI, leafI, tutorial } from "./constants";
import { NavigationContext } from "./navigation";
import { generateDataTree } from "@/utils/tree";

interface contextOutputI {
  data: dataI;
  item: itemI;
  editMode: boolean;
  updateEditMode: any;
  updateData: (value: dataI, reset: boolean) => void;
  resetData: () => void;
  selectedNote: string;
  setSelectedNote: any;
  tree: leafI[];
  setTree: any;
  updateSelectedNote: any;
  gmMode: boolean;
  setGmMode: any;
}

export const DataContext = createContext<contextOutputI>({
  data: tutorial,
  item: tutorial["RootPage"],
  editMode: false,
  updateEditMode: () => {},
  updateData: (value: dataI, reset: boolean) => {},
  resetData: () => {},
  selectedNote: "",
  setSelectedNote: () => {},
  tree: [],
  setTree: () => {},
  updateSelectedNote: () => {},
  gmMode: false,
  setGmMode: () => {},
});

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [data, setData] = useState<dataI>(tutorial);
  const [tree, setTree] = useState<leafI[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<string>("RootPage");
  const [gmMode, setGmMode] = useState<boolean>(false);

  const { path, resetPath, getCurrentPage } = useContext(NavigationContext);

  const updateData = (value: dataI, resetEntry: boolean = true): void => {
    console.log(value);
    const cleanData = cleanUpData(value);
    setTimeout(() => {
      setData(cleanData);
      setTree(generateDataTree(cleanData));
      if (resetEntry) resetPath();
      saveToLocalStorage(cleanData);
    }, 0);
  };

  const cleanUpData = (value: dataI): dataI => {
    const deletedKeys: string[] = [];
    const references: string[] = ["RootPage"];

    Object.keys(value).forEach((key: string) => {
      // get used references
      extractReferences(value[key].text).forEach((v) => {
        const key = v.split("_")[0];
        if (!references.includes(key)) references.push(key);
      });
      // delete emtpy references
      if (value[key].text === "" && key !== "RootPage") {
        delete value[key];
        deletedKeys.push(key);
      }
    });

    // remove ununused references
    Object.keys(value).forEach((key: string) => {
      if (!references.includes(key)) {
        delete value[key];
        deletedKeys.push(key);
      }
    });

    // reset path only if the current path is deleted
    const currentPath = path.at(-1) || undefined;
    if (currentPath !== undefined && deletedKeys.includes(currentPath)) {
      resetPath();
    }

    // remove deleted keys from text
    // Object.keys(value).forEach((key: string) => {
    //   value[key].text = removeReferences(value[key].text, deletedKeys);
    // });
    return value;
  };

  const resetData = (): void => {
    updateData({ ...tutorial }, true);
  };

  const updateEditMode = (value: boolean): void => {
    setEditMode(value);
  };

  const updateSelectedNote = (key: string): void => {
    setSelectedNote(key);
    setTimeout(() => {
      document.querySelector(`#note-${key}`)?.scrollIntoView();
      // add animation to card
      document.querySelector(`#note-${key}`)?.classList.add("flash");
      setTimeout(() => {
        document.querySelector(`#note-${key}`)?.classList.remove("flash");
      }, 600);
    }, 0);
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
  }, [path, data]);

  useEffect(() => {
    if (!gmMode) return;
    const retrieved = retrieveLocalStorage();
    try {
      const parsed = JSON.parse(retrieved);
      Object.keys(parsed).forEach((key: string) => {
        if (parsed[key].showInTree === undefined)
          parsed[key].showInTree === false;
      });
      updateData(parsed as dataI);
    } catch (err) {
      console.log(err);
    }
  }, [gmMode]);

  useEffect(() => {
    setTimeout(() => updateEditMode(false), 0);
  }, [path]);

  return (
    <DataContext.Provider
      value={{
        data,
        item: data[getCurrentPage()] || tutorial["RootPage"],
        editMode,
        updateEditMode,
        updateData,
        resetData,
        selectedNote,
        setSelectedNote,
        tree,
        setTree,
        updateSelectedNote,
        gmMode,
        setGmMode,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
