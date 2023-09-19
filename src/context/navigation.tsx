import { ReactElement, createContext, useEffect, useState } from "react";

interface contextOutputI {
  path: string[];
  setPath: any;
  navBack: () => void;
  navigateTo: (value: string) => void;
  resetPath: () => void;
  getCurrentPage: () => string;
}

export const NavigationContext = createContext<contextOutputI>({
  path: [],
  setPath: () => {},
  navBack: () => {},
  navigateTo: (value: string) => {},
  resetPath: () => {},
  getCurrentPage: () => "",
});

const resetNotesScroll = () => {
  document.querySelector("#notes")?.scrollTo({ top: 0 });
};

export const NavigationProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [path, setPath] = useState<string[]>(["RootPage"]);
  const navBack = () => {
    if (path.length === 1) return;
    setPath((oldValue: string[]) => oldValue.slice(0, oldValue.length - 1));
    setTimeout(resetNotesScroll, 0);
  };

  const navigateTo = (value: string) => {
    setPath((oldValue: string[]) => {
      return [...oldValue, value];
    });
    setTimeout(resetNotesScroll, 0);
  };

  const resetPath = () => {
    setPath(["RootPage"]);
    setTimeout(resetNotesScroll, 0);
  };

  const getCurrentPage = () => {
    return path.at(-1) || "RootPage";
  };

  useEffect(() => {
    if (path.length < 1) {
      resetPath();
    }
  }, [path]);

  return (
    <NavigationContext.Provider
      value={{ path, setPath, navBack, navigateTo, resetPath, getCurrentPage }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
