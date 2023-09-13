import { itemI, referenceI } from "@/api/data";
import { ReactElement, createContext, useEffect, useState } from "react";

interface contextOutputI {
  data: dataI;
  item: itemI;
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
  const [references, setReferences] = useState<referenceI[]>([]);
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

  return (
    <DataContext.Provider
      value={{
        data,
        item: data[item] || emptyItem,
        updateData,
        updateItem: setItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
