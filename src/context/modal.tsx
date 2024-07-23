"use client";

import { ReactElement, createContext, useState } from "react";

interface contextOutputI {
  isVisible: boolean;
  closeModal: any;
  content: ReactElement | null;
  setContent: (children: ReactElement, closeOnBg?: boolean) => void;
  closeOnBg: boolean;
}

export const modalContext = createContext<contextOutputI>({
  isVisible: false,
  closeModal: () => {},
  content: null,
  setContent: (children: ReactElement, closeOnBg: boolean = false) => {},
  closeOnBg: false,
});

export const ModalProvider = ({ children }: { children: ReactElement }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [closeOnBg, setCloseOnBg] = useState<boolean>(false);
  const [content, setContent] = useState<ReactElement | null>(
    <span className={"text paragraph"}>This is the content</span>
  );

  const updateContent = (children: ReactElement, newCloseOnBg = true): void => {
    setCloseOnBg(newCloseOnBg);
    setContent(children);
    setIsVisible(true);
  };

  const closeModal = (): void => {
    setIsVisible(false);
  };

  return (
    <modalContext.Provider
      value={{
        isVisible,
        closeModal,
        content,
        setContent: updateContent,
        closeOnBg,
      }}
    >
      {children}
    </modalContext.Provider>
  );
};
