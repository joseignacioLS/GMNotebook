"use client";

import { extractReferences } from "@/utils/text";
import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  exceptionKeys,
  fallBack,
  IData,
  IItem,
  ILeaf,
  initPage,
} from "./constants";
import { NavigationContext } from "./navigation";
import { generateDataTree } from "@/utils/tree";
import { saveToFileHandle } from "@/utils/file";
import { useRouter } from "next/navigation";

import LZString from "lz-string";
import { toastContext } from "./toast";
import { loadingContext } from "./loading";

interface contextOutputI {
  data: IData;
  item: IItem;
  updateEditMode: any;
  canEdit: boolean;
  updateData: (
    value: IData,
    reset: boolean,
    saveToFile?: boolean,
    other?: boolean
  ) => void;
  resetData: () => void;
  selectedNote: string;
  setSelectedNote: any;
  tree: ILeaf[];
  setTree: any;
  updateSelectedNote: any;
  editMode: boolean;
  setEditMode: any;
  updateFileHandle: any;
  getDataFromRemote: any;
  highlightNote: (key: string) => void;
}

export const DataContext = createContext<contextOutputI>({
  data: fallBack,
  item: fallBack["RootPage"],
  editMode: false,
  canEdit: true,
  updateEditMode: () => {},
  updateData: (value: IData, reset: boolean) => {},
  resetData: () => {},
  selectedNote: "",
  setSelectedNote: () => {},
  tree: [],
  setTree: () => {},
  updateSelectedNote: () => {},
  setEditMode: () => {},
  updateFileHandle: () => {},
  getDataFromRemote: () => {},
  highlightNote: (key) => {},
});

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [data, setData] = useState<IData>(fallBack);
  const [tree, setTree] = useState<ILeaf[]>(generateDataTree(fallBack));
  const [canEdit, setCanEdit] = useState(true);
  const [selectedNote, setSelectedNote] = useState<string>("RootPage");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(
    null
  );
  const { showToastError, showToastSuccess } = useContext(toastContext);
  const { setShow: setShowLoading } = useContext(loadingContext);

  const { path, resetPath, currentPage } = useContext(NavigationContext);

  const router = useRouter();

  const fetchTutorial = async () => {
    const res = await fetch("/data/tutorial.json");
    const data = await res.json();
    return data;
  };

  const getDataFromRemote = async (remoteData: string) => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${remoteData}`
      );
      if (resp.status !== 200) throw Error("Could not load from remote");
      else {
        const data = (await resp.json()).data;
        setData(data);
        setTree(generateDataTree(data));
        setCanEdit(false);
        setShowLoading(false);
        return;
      }
    } catch (err) {
      console.warn(err);
    }
    try {
      const decompress: IData = JSON.parse(
        LZString.decompressFromEncodedURIComponent(remoteData)
      );
      if (!decompress.RootPage) throw Error("Bad data format");
      setData(decompress);
      setTree(generateDataTree(decompress));
      showToastSuccess("Success loading data");
      setCanEdit(false);
      setShowLoading(false);
    } catch (err) {
      console.warn(err);
      setShowLoading(false);
      showToastError("Could not load data");
      router.replace("/");
    }
  };

  const updateData = (
    newData: IData,
    resetEntry: boolean = true,
    saveToFile: boolean = true,
    preservePreviousState: boolean = true
  ): void => {
    setData((prevState: IData) => {
      const cleanData = preservePreviousState
        ? { ...prevState, ...newData }
        : newData;
      const updatedData = structuredClone(cleanData);
      setTree(generateDataTree(updatedData));
      if (resetEntry) resetPath();
      if (fileHandle && saveToFile) saveToFileHandle(fileHandle, updatedData);
      return updatedData;
    });
  };

  const updateFileHandle = async (newFileHandle: FileSystemFileHandle) => {
    setFileHandle(newFileHandle);
    const file = await newFileHandle.getFile();
    const text = await file.text();
    const recoveredData = JSON.parse(text) as IData;
    const cleanedUp = cleanUpData(recoveredData);
    updateData(cleanedUp, true, false, false);
  };

  const checkItemsParams = (value: IData) => {
    const checkedObject = structuredClone(value);
    // check params
    Object.keys(checkedObject).forEach((key: string) => {
      Object.entries(initPage).forEach((entry) => {
        const defKey = entry[0] as keyof IItem;
        const defValue = entry[1];
        if (checkedObject[key][defKey] === undefined) {
          checkedObject[key][defKey] = defValue as never;
        }
      });
    });
    return checkedObject;
  };

  const removeUnusedReferences = (value: IData) => {
    const processedObject = structuredClone(value);
    const deletedKeys: string[] = [];
    const references: string[] = [];

    Object.keys(processedObject).forEach((key: string) => {
      // get used references
      extractReferences(processedObject[key].text).forEach((v) => {
        const key = v.split("_")[0];
        if (!references.includes(key)) references.push(key);
      });
    });
    // remove ununused references
    Object.keys(processedObject).forEach((key: string) => {
      if (!references.includes(key) && !exceptionKeys.includes(key)) {
        delete processedObject[key];
        deletedKeys.push(key);
      }
    });

    // reset path only if the current path is deleted
    const currentPath = path.at(-1) || undefined;
    if (currentPath !== undefined && deletedKeys.includes(currentPath)) {
      resetPath();
    }
    return processedObject;
  };

  const cleanUpData = (value: IData): IData => {
    const checkedItems = checkItemsParams(value);
    return checkedItems;
  };

  const resetData = async (): Promise<void> => {
    router.replace("/");
    setCanEdit(true);
    fetchTutorial().then((tutorial) => {
      updateData(tutorial, true);
    });
  };

  const updateEditMode = (value: boolean): void => {
    setEditMode(value);
  };

  const highlightNote = (key: string): void => {
    setTimeout(() => {
      document.querySelector(`#note-${key}`)?.scrollIntoView();
      // add animation to card
      document.querySelector(`#note-${key}`)?.classList.add("flash");
      setTimeout(() => {
        document.querySelector(`#note-${key}`)?.classList.remove("flash");
      }, 600);
    }, 0);
  };

  const updateSelectedNote = (key: string): void => {
    setSelectedNote(key);
    highlightNote(key);
  };

  useEffect(() => {
    fetchTutorial().then((tutorial) => {
      updateData(tutorial);
    });
  }, []);

  useEffect(() => {
    updateEditMode(false);
    setData((oldData) => {
      return removeUnusedReferences(oldData);
    });
  }, [path]);

  useEffect(() => {
    if (data?.RootPage === undefined) {
      fetchTutorial().then((tutorial) => {
        updateData(tutorial);
        setFileHandle(null);
      });
      return;
    }
    if (!data?.[currentPage]) {
      resetPath();
      return;
    }
  }, [path, data]);

  return (
    <DataContext.Provider
      value={{
        data,
        item: data?.[currentPage] || fallBack["RootPage"],
        editMode,
        canEdit,
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
        getDataFromRemote,
        highlightNote,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
