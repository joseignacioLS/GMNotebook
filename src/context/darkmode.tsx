import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { ReactElement, createContext, useEffect, useState } from "react";

interface contextOutputI {
  darkMode: boolean;
  toggleDarkMode: any;
}

export const darkModeContext = createContext<contextOutputI>({
  darkMode: true,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: ReactElement }) => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const toggleDarkMode = () => {
    setDarkMode((v) => {
      const newValue = !v;
      saveToLocalStorage(newValue, "darkMode");
      return newValue;
    });
  };

  useEffect(() => {
    const retrieved = retrieveLocalStorage("darkMode") === "true";
    setDarkMode(retrieved);
  }, []);
  return (
    <darkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </darkModeContext.Provider>
  );
};
