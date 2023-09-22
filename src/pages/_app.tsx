import { DataProvider } from "@/context/data";
import { ModalProvider } from "@/context/modal";
import { NavigationProvider } from "@/context/navigation";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <NavigationProvider>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </NavigationProvider>
    </ModalProvider>
  );
}
