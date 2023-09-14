import {
  getTextReferences,
  includeRerencesInText,
  splitTextIntoReferences,
} from "@/utils/text";
import { ReactElement, createContext, useEffect, useState } from "react";

export interface itemI {
  title: string;
  text: string;
  key: string;
  display: string;
  baseEntry?: string;
}

export interface referenceI {
  key: string;
  index?: number;
  id?: string;
  data?: itemI;
  visible: boolean;
  color: string;
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
  updateData: (value: dataI) => void;
  updateItem: (key: string) => void;
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
  updateData: (value: dataI) => {},
  updateItem: (key: string) => {},
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

  const updateData = (value: dataI) => {
    setData({});
    setTimeout(() => setData(value), 0);
    saveToLocalStorage(value);
  };

  useEffect(() => {
    const retrieved = retrieveLocalStorage();
    const parsed = JSON.parse(retrieved);
    setData(parsed);
    setItem(
      Object.keys(parsed).find((key: string) => {
        return parsed[key].baseEntry === "1";
      }) || ""
    );
  }, []);

  useEffect(() => {
    if (!data[item]?.text || !data) return;
    const referenceText = includeRerencesInText(data[item].text, data, [
      data[item].key,
    ]);
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
        updateItem: setItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
