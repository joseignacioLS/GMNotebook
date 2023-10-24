import { extractReferences } from "@/utils/text";
import { ReactElement, createContext, useEffect, useState } from "react";
import { dataI, itemI, leafI, placeholder } from "./constants";
import { generateDataTree } from "@/utils/tree";
import { postRequest } from "@/utils/api";
import { useRouter } from "next/router";

interface contextOutputI {
  data: dataI;
  item: itemI;
  editMode: boolean;
  updateEditMode: any;
  updateData: (value: dataI, reset: boolean) => void;
  resetData: () => void;
  selectedNote: string;
  tree: leafI[];
  setTree: any;
  updateSelectedNote: any;
  gmMode: boolean;
  setGmMode: any;
  gameName: string;
  setCredentials: (value: any) => void;
  updatedWithServer: boolean;
  currentPage: string;
  setCurrentPage: any;
}

export const DataContext = createContext<contextOutputI>({
  data: placeholder,
  item: placeholder["RootPage"],
  updateData: (value: dataI, reset: boolean) => {},
  resetData: () => {},
  tree: [],
  setTree: () => {},
  editMode: false,
  updateEditMode: () => {},
  gmMode: false,
  setGmMode: () => {},
  selectedNote: "",
  updateSelectedNote: () => {},
  gameName: "",
  setCredentials: (value: any) => {},
  currentPage: "",
  setCurrentPage: (value: any) => {},
  updatedWithServer: false,
});

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [credentials, setCredentials] = useState<{
    gameName: string;
    password: string;
  }>({ gameName: "", password: "" });
  const [data, setData] = useState<dataI>(placeholder);
  const [currentPage, setCurrentPage] = useState<string>("");
  const [tree, setTree] = useState<leafI[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<string>("");
  const [gmMode, setGmMode] = useState<boolean>(false);
  const router = useRouter();
  const [updatedWithServer, setUpdatedWithServer] = useState<boolean>(true);
  const [serverTimeout, setServerTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  const resetView = () => {
    router.push(`/${credentials.gameName}/RootPage`);
  };

  const updateData = (value: dataI, resetEntry: boolean = true): void => {
    setUpdatedWithServer(false);
    const cleanData = cleanUpData(value);
    setTimeout(() => {
      setData(cleanData);
      setTree(generateDataTree(cleanData));
      if (resetEntry) {
        resetView();
      }
    }, 0);
  };

  const saveToServer = (delay = 10000) => {
    clearTimeout(serverTimeout);
    if (credentials.gameName === "") return;
    const to = setTimeout(async () => {
      const response = await postRequest(`${credentials.gameName}`, {
        data: data,
        password: credentials.password,
      });
      if (response.status === 200) {
        setUpdatedWithServer(true);
      } else {
        setUpdatedWithServer(false);
      }
      setServerTimeout(undefined);
    }, delay);
    setServerTimeout(to);
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
    });

    // remove ununused references
    Object.keys(value).forEach((key: string) => {
      if (!references.includes(key)) {
        delete value[key];
        deletedKeys.push(key);
      }
    });

    // reset path only if the current path is deleted
    if (currentPage !== undefined && deletedKeys.includes(currentPage)) {
      resetView();
    }
    return value;
  };

  const resetData = (): void => {
    updateData({ ...placeholder }, true);
  };

  const updateGmMode = (value: boolean): void => {
    if (!value) {
      if (!data[currentPage].showToPlayers) {
        resetView();
      }
    }
    setGmMode(value);
  };

  const updateEditMode = (value: boolean): void => {
    setEditMode(value);
  };

  const updateSelectedNote = (key: string): void => {
    setSelectedNote(key || currentPage);
    document.querySelector(`#note-${key}`)?.scrollIntoView();
  };

  useEffect(() => {
    saveToServer();
    return () => {
      clearTimeout(serverTimeout);
    };
  }, [data]);

  useEffect(() => {
    if (credentials.password !== "") {
      saveToServer(100);
    }
    return () => {
      clearTimeout(serverTimeout);
    };
  }, [currentPage]);

  useEffect(() => {
    if (editMode) return;
    saveToServer(100);
    return () => {
      clearTimeout(serverTimeout);
    };
  }, [editMode]);

  return (
    <DataContext.Provider
      value={{
        data,
        item: data[currentPage || "RootPage"] || placeholder["RootPage"],
        editMode,
        updateEditMode,
        updateData,
        resetData,
        selectedNote,
        tree,
        setTree,
        updateSelectedNote,
        gmMode,
        setGmMode: updateGmMode,
        gameName: credentials.gameName,
        setCredentials,
        updatedWithServer,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
