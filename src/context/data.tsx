"use client";

import { extractReferences } from "@/utils/text";
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
import { saveToFileHandle } from "@/utils/file";

interface contextOutputI {
  data: dataI;
  item: itemI;
  updateEditMode: any;
  updateData: (value: dataI, reset: boolean) => void;
  resetData: () => void;
  selectedNote: string;
  setSelectedNote: any;
  tree: leafI[];
  setTree: any;
  updateSelectedNote: any;
  editMode: boolean;
  setEditMode: any;
  updateFileHandle: any;
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
  setEditMode: () => {},
  updateFileHandle: () => {},
});

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [data, setData] = useState<dataI>(tutorial);
  const [tree, setTree] = useState<leafI[]>([]);
  const [selectedNote, setSelectedNote] = useState<string>("RootPage");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(
    null
  );

  const { path, resetPath, getCurrentPage } = useContext(NavigationContext);

  const updateData = (
    value: dataI,
    resetEntry: boolean = true,
    saveToFile: boolean = true
  ): void => {
    const cleanData = cleanUpData(value);
    setData(JSON.parse(JSON.stringify(cleanData)));
    setTree(generateDataTree(cleanData));
    if (resetEntry) resetPath();
    // saveToLocalStorage(cleanData);
    if (fileHandle && saveToFile) saveToFileHandle(fileHandle, cleanData);
  };

  const updateFileHandle = async (newFileHandle: FileSystemFileHandle) => {
    setFileHandle(newFileHandle);
    const file = await newFileHandle.getFile();
    const text = await file.text();
    updateData(JSON.parse(text) as dataI, true, false);
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
      // if (value[key].text === "" && key !== "RootPage") {
      //   delete value[key];
      //   deletedKeys.push(key);
      // }
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
      setFileHandle(null);
      return;
    }
    const currentPage = getCurrentPage();
    if (!data?.[currentPage]) {
      resetPath();
      return;
    }
  }, [path, data]);

  // useEffect(() => {
  //   const retrieved = retrieveLocalStorage();
  //   try {
  //     const parsed = JSON.parse(retrieved);
  //     Object.keys(parsed).forEach((key: string) => {
  //       if (parsed[key].showInTree === undefined)
  //         parsed[key].showInTree === false;
  //     });
  //     updateData(parsed as dataI);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  useEffect(() => {
    updateEditMode(false);
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
        setEditMode,
        updateFileHandle,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
