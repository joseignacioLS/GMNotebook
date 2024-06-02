import { DataProvider } from "@/context/data";
import { ModalProvider } from "@/context/modal";
import { NavigationProvider } from "@/context/navigation";

import "../styles/globals.scss";

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
