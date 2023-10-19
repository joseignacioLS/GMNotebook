import { ReactElement, createContext, useState } from "react";

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
    setDarkMode((v) => !v);
  };
  return (
    <darkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </darkModeContext.Provider>
  );
};
