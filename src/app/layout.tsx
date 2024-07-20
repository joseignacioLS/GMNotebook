import { Inclusive_Sans, Merriweather } from "next/font/google";
import ContextProvider from "./ContextProvider";

import "../styles/globals.scss";

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
      <ContextProvider>
        <body className={`${inclusive.variable} ${merriweather.variable}`}>
          {children}
        </body>
      </ContextProvider>
    </html>
  );
}
