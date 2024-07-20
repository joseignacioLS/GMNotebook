"use client";

import { ColorProvider } from "@/context/colors";
import { DataProvider } from "@/context/data";
import { LoadingProvider } from "@/context/loading";
import { ModalProvider } from "@/context/modal";
import { ToastProvider } from "@/context/toast";

import { NavigationProvider } from "@/context/navigation";

import { ReactElement } from "react";

interface IProps {
  children: ReactElement;
}

const ContextProvider: React.FC<IProps> = ({ children }) => {
  return (
    <LoadingProvider>
      <ToastProvider>
        <ColorProvider>
          <ModalProvider>
            <NavigationProvider>
              <DataProvider>{children}</DataProvider>
            </NavigationProvider>
          </ModalProvider>
        </ColorProvider>
      </ToastProvider>
    </LoadingProvider>
  );
};

export default ContextProvider;
