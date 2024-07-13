"use client";

import { ReactElement, createContext, useState } from "react";

interface ILoadingOutput {
  show: boolean;
  setShow: (state: boolean) => void;
}

export const loadingContext = createContext<ILoadingOutput>({
  show: true,
  setShow: (state: boolean) => {},
});

export const LoadingProvider = ({ children }: { children: ReactElement }) => {
  const [show, setShow] = useState(true);
  return (
    <loadingContext.Provider
      value={{
        show,
        setShow,
      }}
    >
      {children}
    </loadingContext.Provider>
  );
};
