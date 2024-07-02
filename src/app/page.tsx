"use client";

import Modal from "@/components/Modal/Modal";
import NoteBook from "../components/NoteBook";
import { useState } from "react";
import DataActions from "@/components/DataActions";

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  return (
    <main className={darkMode ? "dark" : "white"}>
      <NoteBook />
      <Modal />
      <DataActions darkMode={darkMode} setDarkMode={setDarkMode} />
    </main>
  );
}
