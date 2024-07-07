import { DataProvider } from "@/context/data";
import { ModalProvider } from "@/context/modal";
import { NavigationProvider } from "@/context/navigation";

import "../styles/globals.scss";
import { ColorProvider } from "@/context/colors";
import Head from "next/head";

export const metadata = {
  title: "GM Notebook",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ColorProvider>
        <ModalProvider>
          <NavigationProvider>
            <DataProvider>
              <body>{children}</body>
            </DataProvider>
          </NavigationProvider>
        </ModalProvider>
      </ColorProvider>
    </html>
  );
}
