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
    <p>This is the content</p>
  );

  const updateContent = (children: ReactElement) => {
    setContent(children);
    setIsVisible(true);
  };

  const closeModal = () => {
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
