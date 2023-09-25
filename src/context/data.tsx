import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getTextReferences, splitTextIntoReferences } from "@/utils/text";
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

interface contextOutputI {
  data: dataI;
  item: itemI;
  editMode: boolean;
  setEditMode: any;
  textPieces: textPieceI[];
  updateTextPieces: (cb: (value: textPieceI[]) => textPieceI[]) => void;
  updateData: (value: dataI, reset: boolean) => void;
  resetData: () => void;
  selectedNote: string;
  setSelectedNote: any;
  generateDisplayText: any;
  tree: leafI[];
  setTree: any;
}

export const DataContext = createContext<contextOutputI>({
  data: tutorial,
  item: tutorial["RootPage"],
  editMode: false,
  setEditMode: () => {},
  textPieces: [],
  updateTextPieces: (cb: (value: textPieceI[]) => {}) => {},
  updateData: (value: dataI, reset: boolean) => {},
  resetData: () => {},
  selectedNote: "",
  setSelectedNote: () => {},
  generateDisplayText: () => {},
  tree: [],
  setTree: () => {},
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

const generateDataTree = (value: dataI) => {
  const tree: leafI[] = Object.keys(value).map((key, index) => {
    const n = key.split("").reduce((acc: number, curr: string) => {
      return acc + curr.charCodeAt(0);
    }, 0);
    const x = (n * 321) % 80;
    const y = (n * 581) % 80;
    return {
      index,
      key,
      children: [],
      position: [10 + x, 10 + y],
    };
  });

  Object.keys(value).forEach((key) => {
    const leaf = tree.findIndex((v: leafI) => v.key === key);
    const refes = getTextReferences(value[key].text);
    tree[leaf].children = refes.map((v) => {
      return tree.findIndex((k: leafI) => k.key === v);
    });
  });
  return tree;
};

export const DataProvider = ({ children }: { children: ReactElement }) => {
  const [data, setData] = useState<dataI>(tutorial);
  const [tree, setTree] = useState<leafI[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [textPieces, setTextPieces] = useState<textPieceI[]>([]);
  const [selectedNote, setSelectedNote] = useState<string>("RootPage");

  const { path, resetPath, getCurrentPage } = useContext(NavigationContext);

  const updateSelectedNote = (key: string) => {
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

  const cleanUpData = (value: dataI) => {
    const deletedKeys: string[] = [];
    const references: string[] = ["RootPage"];
    Object.keys(value).forEach((key: string) => {
      getTextReferences(value[key].text).forEach((v) => {
        if (!references.includes(v)) references.push(v);
      });

      if (value[key].text === "" && key !== "RootPage") {
        delete value[key];
        deletedKeys.push(key);
      }
    });

    Object.keys(value).forEach((key: string) => {
      if (!references.includes(key)) {
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
    value = cleanUpData(value);
    setTimeout(() => {
      setData(value);
      if (resetEntry) resetPath();
      saveToLocalStorage(value);
    }, 0);
  };

  const resetData = () => {
    updateData({ ...tutorial }, true);
  };

  const proccessTextPieces = (text: textPieceI[], referenceStyle: string) => {
    const chuncks: ReactElement[] = text.map((ele, i) => {
      if (ele.type === "reference") {
        const reference: referenceI = ele as referenceI;
        const content: string = data[reference.key]?.display || "";
        return (
          <span
            key={i}
            id={reference.id}
            className={`${referenceStyle}`}
            style={{
              backgroundColor:
                referenceStyle !== "" ? reference.color : "transparent",
            }}
            onClick={() => updateSelectedNote(reference.key || "")}
          >
            {content}
          </span>
        );
      } else if (ele.type === "text") {
        return <span key={i}>{ele.content}</span>;
      } else if (ele.type === "break") {
        return <br key={i} />;
      } else if (ele.type === "image") {
        const url: string = ele.content.split("img:")[1];
        return <img key={i} src={url} />;
      }
      return <></>;
    });
    return chuncks;
  };

  const generateDisplayText = (text: textPieceI[], referenceStyle: string) => {
    const ps = [
      -1,
      ...text
        .map((v, i) => (v.type === "break" ? i : undefined))
        .filter((v) => v !== undefined),
      text.length,
    ];
    const output = [];
    let pIndex = 0;
    for (let i = 0; i < ps.length - 1; i++) {
      const start = (ps[i] || -1) + 1;
      const end = ps[i + 1];
      const content = proccessTextPieces(
        text.slice(start, end),
        referenceStyle
      );
      output.push(
        <p key={`p-${pIndex}`}>{content.length > 0 ? content : " "}</p>
      );
      pIndex += 1;
    }
    return output;
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
    setTree(generateDataTree(data));
  }, [data]);

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
    updateVisibleReferences();
  }, [editMode]);

  return (
    <DataContext.Provider
      value={{
        data,
        item: data[getCurrentPage()] || tutorial["RootPage"],
        textPieces,
        editMode,
        setEditMode,
        updateTextPieces: setTextPieces,
        updateData,
        resetData,
        selectedNote,
        setSelectedNote,
        generateDisplayText,
        tree,
        setTree,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
