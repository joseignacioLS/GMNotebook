import { DataProvider } from "@/context/data";
import { ModalProvider } from "@/context/modal";
import { NavigationProvider } from "@/context/navigation";
import Head from "next/head";

import "../styles/globals.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>GM Notebook</title>
      </Head>
      <ModalProvider>
        <NavigationProvider>
          <DataProvider>
            <body>{children}</body>
          </DataProvider>
        </NavigationProvider>
      </ModalProvider>
    </html>
  );
}
