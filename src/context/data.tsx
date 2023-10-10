import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import {
  getTextReferences,
  removeReferences,
  splitTextIntoReferences,
} from "@/utils/text";
import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  dataI,
  itemI,
  leafI,
  referenceI,
  textPieceI,
  tutorial,
} from "./constants";
import { NavigationContext } from "./navigation";
import { generateDataTree } from "@/utils/tree";

import { useSearchParams } from "next/navigation";

interface contextOutputI {
  data: dataI;
  item: itemI;
  editMode: boolean;
  updateEditMode: any;
  textPieces: textPieceI[];
  updateData: (value: dataI, reset: boolean) => void;
  resetData: () => void;
  selectedNote: string;
  setSelectedNote: any;
  tree: leafI[];
  setTree: any;
  updateSelectedNote: any;
  gmMode: boolean;
}

export const DataContext = createContext<contextOutputI>({
  data: tutorial,
  item: tutorial["RootPage"],
  editMode: false,
  updateEditMode: () => {},
  textPieces: [],
  updateData: (value: dataI, reset: boolean) => {},
  resetData: () => {},
  selectedNote: "",
  setSelectedNote: () => {},
  tree: [],
  setTree: () => {},
  updateSelectedNote: () => {},
  gmMode: false,
});

const checkItemVisibility = (id: string) => {
  const boundingRect = document
    .querySelector(`#${id}`)
    ?.getBoundingClientRect();
  if (!boundingRect) return false;
  const notesContainer = document.querySelector("#text") as any;
  const titleSpace = 80;
  return (
    boundingRect.top >= titleSpace &&
    boundingRect.top <= (notesContainer?.offsetHeight || 0) + titleSpace
  );
};

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [data, setData] = useState<dataI>(tutorial);
  const [tree, setTree] = useState<leafI[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [textPieces, setTextPieces] = useState<textPieceI[]>([]);
  const [selectedNote, setSelectedNote] = useState<string>("RootPage");
  const [gmMode, setGmMode] = useState<boolean>(true);

  const { path, resetPath, getCurrentPage } = useContext(NavigationContext);

  const queryParams = useSearchParams();

  const updateData = (value: dataI, resetEntry: boolean = true): void => {
    value = cleanUpData(value);
    setTimeout(() => {
      setData(value);
      setTree(generateDataTree(value));
      if (resetEntry) resetPath();
      saveToLocalStorage(value);
    }, 0);
  };

  const cleanUpData = (value: dataI): dataI => {
    const deletedKeys: string[] = [];
    const references: string[] = ["RootPage"];

    Object.keys(value).forEach((key: string) => {
      // get used references
      getTextReferences(value[key].text).forEach((v) => {
        if (!references.includes(v)) references.push(v);
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
    Object.keys(value).forEach((key: string) => {
      value[key].text = removeReferences(value[key].text, deletedKeys);
    });
    return value;
  };

  const resetData = (): void => {
    updateData({ ...tutorial }, true);
  };

  const updateVisibleReferences = (): void => {
    setTextPieces((oldValue: textPieceI[]) => {
      return oldValue.map((ref: textPieceI) => {
        if (ref.type !== "reference") return ref;
        const refItem = ref as referenceI;
        const visible = checkItemVisibility(refItem.id || "");
        const newRef = {
          ...ref,
          visible,
        } as textPieceI;
        return newRef;
      }) as textPieceI[];
    });
  };

  const updateEditMode = (value: boolean): void => {
    setEditMode(value);
    updateVisibleReferences();
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
    const referenceText = data[currentPage].text;
    const references = getTextReferences(referenceText);
    if (!references) return setTextPieces([]);
    const refes = splitTextIntoReferences(referenceText);
    setTextPieces(refes);
    setTimeout(updateVisibleReferences, 100);
  }, [path, data]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const gmMode = queryParams.get("gm");
    const gameName = queryParams.get("game");
    setGmMode(gmMode === "true" && gmMode !== null);
  }, [queryParams]);

  useEffect(() => {
    document
      .querySelector("#text")
      ?.addEventListener("scroll", updateVisibleReferences);
    return () =>
      document
        .querySelector("#text")
        ?.removeEventListener("scroll", updateVisibleReferences);
  }, [textPieces, updateVisibleReferences, editMode]);

  useEffect(() => {
    setTimeout(() => updateEditMode(false), 0);
  }, [path]);

  return (
    <DataContext.Provider
      value={{
        data,
        item: data[getCurrentPage()] || tutorial["RootPage"],
        textPieces,
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
