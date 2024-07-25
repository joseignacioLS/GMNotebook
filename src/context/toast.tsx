"use client";

import {
  ReactElement,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

export enum EToastType {
  SUCCESS,
  ERROR,
}

interface IToastOutput {
  text: string;
  type: EToastType;
  showToastSuccess: (text: string) => void;
  showToastError: (text: string) => void;
}

export const toastContext = createContext<IToastOutput>({
  text: "",
  type: EToastType.SUCCESS,
  showToastSuccess: (text: string) => {},
  showToastError: (text: string) => {},
});

export const ToastProvider = ({ children }: { children: ReactElement }) => {
  const [text, setText] = useState("");
  const [type, setType] = useState(EToastType.SUCCESS);
  const timeOut = useRef<any>(undefined);

  const showToast = (showText: string) => {
    setText(showText);
    timeOut.current = setTimeout(() => {
      setText("");
    }, 5000);
  };

  const showToastSuccess = (showText: string) => {
    setType(EToastType.SUCCESS);
    showToast(showText);
  };

  const showToastError = (showText: string) => {
    setType(EToastType.ERROR);
    showToast(showText);
  };
  useEffect(() => {
    return () => {
      clearTimeout(timeOut.current);
    };
  }, []);
  return (
    <toastContext.Provider
      value={{
        text,
        type,
        showToastSuccess,
        showToastError,
      }}
    >
      {children}
    </toastContext.Provider>
  );
};
