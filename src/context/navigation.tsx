"use client";

import { ReactElement, createContext, useState } from "react";

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
  document.querySelector("#text")?.scrollTo({ top: 0 });
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

  const navigateTo = (value: string): void => {
    setPath((oldValue: string[]) => {
      return [
        ...oldValue.slice(Math.max(oldValue.length - 16, 0), oldValue.length),
        value,
      ];
    });
    setTimeout(resetNotesScroll, 0);
  };

  const resetPath = (): void => {
    setTimeout(() => {
      setPath(["RootPage"]);
      resetNotesScroll();
    }, 0);
  };

  const getCurrentPage = (): string => {
    return path.at(-1) || "RootPage";
  };

  return (
    <NavigationContext.Provider
      value={{ path, setPath, navBack, navigateTo, resetPath, getCurrentPage }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
