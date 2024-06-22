"use client";

import Modal from "@/components/Modal/Modal";
import NoteBook from "../components/NoteBook";
import ToggleButton from "@/components/Button/ToggleButton";
import { useState } from "react";
import DataActions from "@/components/DataActions";

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  return (
    <main className={darkMode ? "dark" : "white"}>
      <div
        style={{
          position: "fixed",
          left: "1rem",
          bottom: "1rem",
          zIndex: "10",
        }}
        onClick={() => setDarkMode((v) => !v)}
      ></div>
      <NoteBook />
      <Modal />
      <DataActions darkMode={darkMode} setDarkMode={setDarkMode} />
    </main>
  );
}
