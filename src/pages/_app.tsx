import { DarkModeProvider } from "@/context/darkmode";
import { DataProvider } from "@/context/data";
import { ModalProvider } from "@/context/modal";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import localFont from "next/font/local";

const inclusiveSans = localFont({ src: "../fonts/InclusiveSans-Regular.ttf" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GM Notebook</title>
        <style jsx global>
          {`
            * {
              font-family: ${inclusiveSans.style.fontFamily};
            }
          `}
        </style>
      </Head>
      <div
        className={inclusiveSans.className}
        style={{ width: "100%", height: "100%" }}
      >
        <DarkModeProvider>
          <ModalProvider>
            <DataProvider>
              <Component {...pageProps} />
            </DataProvider>
          </ModalProvider>
        </DarkModeProvider>
      </div>
    </>
  );
}
