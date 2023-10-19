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
import { useSearchParams } from "next/navigation";
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
  setSelectedNote: any;
  tree: leafI[];
  setTree: any;
  updateSelectedNote: any;
  gmMode: boolean;
  setGmMode: any;
  gameName: string;
  setGameName: (value: string) => void;
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
  gameName: "",
  setGameName: (value: string) => {},
});

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [gameName, setGameName] = useState<string>("");
  const [data, setData] = useState<dataI>(tutorial);
  const [tree, setTree] = useState<leafI[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<string>("RootPage");
  const [gmMode, setGmMode] = useState<boolean>(false);
  const router = useRouter();
  const [serverTimeout, setServerTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  const { path, resetPath, getCurrentPage } = useContext(NavigationContext);

  const updateData = (value: dataI, resetEntry: boolean = true): void => {
    const cleanData = cleanUpData(value);
    setTimeout(() => {
      setData(cleanData);
      setTree(generateDataTree(cleanData));
      if (resetEntry) resetPath();
    }, 0);
  };

  const saveToServer = () => {
    clearTimeout(serverTimeout);
    const to = setTimeout(() => {
      postRequest(`${gameName}`, { data: data });
      setServerTimeout(undefined);
    }, 3000);
    setServerTimeout(to);
  };

  useEffect(() => {
    saveToServer();
    return () => {
      clearTimeout(serverTimeout);
    };
  }, [data]);

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
      return;
    }
    const currentPage = getCurrentPage();
    if (!data?.[currentPage]) {
      resetPath();
      return;
    }
  }, [path, data]);

  useEffect(() => {
    setTimeout(() => updateEditMode(false), 0);
  }, [path]);

  useEffect(() => {
    const retrievedGm = router.query.gm === "true";
    setGmMode(retrievedGm);
  }, [router]);

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
        gameName,
        setGameName,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
