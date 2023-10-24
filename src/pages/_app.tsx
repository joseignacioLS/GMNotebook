import { DarkModeProvider } from "@/context/darkmode";
import { DataProvider } from "@/context/data";
import { ModalProvider } from "@/context/modal";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GM Notebook</title>
      </Head>
      <DarkModeProvider>
        <ModalProvider>
          <DataProvider>
            <Component {...pageProps} />
          </DataProvider>
        </ModalProvider>
      </DarkModeProvider>
    </>
  );
}
