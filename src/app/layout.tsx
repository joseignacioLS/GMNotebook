import { DataProvider } from "@/context/data";
import { ModalProvider } from "@/context/modal";
import { NavigationProvider } from "@/context/navigation";
import { Inclusive_Sans, Merriweather } from "next/font/google";
import "../styles/globals.scss";
import { ColorProvider } from "@/context/colors";
import { ToastProvider } from "@/context/toast";
import { LoadingProvider } from "@/context/loading";
import { Suspense } from "react";

const inclusive = Inclusive_Sans({
  weight: ["400"],
  variable: "--font-inclusive",
  subsets: ["latin"],
});
const merriweather = Merriweather({
  weight: ["400", "700"],
  variable: "--font-merriweather",
  subsets: ["latin"],
});

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
      <Suspense>
        <LoadingProvider>
          <ToastProvider>
            <ColorProvider>
              <ModalProvider>
                <NavigationProvider>
                  <DataProvider>
                    <body
                      className={`${inclusive.variable} ${merriweather.variable}`}
                    >
                      {children}
                    </body>
                  </DataProvider>
                </NavigationProvider>
              </ModalProvider>
            </ColorProvider>
          </ToastProvider>
        </LoadingProvider>
      </Suspense>
    </html>
  );
}
