"use client";

import { ReactElement, createContext, useState } from "react";

interface contextOutputI {
  isVisible: boolean;
  closeModal: any;
  content: ReactElement | null;
  setContent: (children: ReactElement) => void;
}

export const modalContext = createContext<contextOutputI>({
  isVisible: false,
  closeModal: () => {},
  content: null,
  setContent: (children: ReactElement) => {},
});

export const ModalProvider = ({ children }: { children: ReactElement }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [content, setContent] = useState<ReactElement | null>(
    <span className={"text paragraph"}>This is the content</span>
  );

  const updateContent = (children: ReactElement): void => {
    setContent(children);
    setIsVisible(true);
  };

  const closeModal = (): void => {
    setIsVisible(false);
  };

  return (
    <modalContext.Provider
      value={{ isVisible, closeModal, content, setContent: updateContent }}
    >
      {children}
    </modalContext.Provider>
  );
};
