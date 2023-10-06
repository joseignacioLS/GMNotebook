import Modal from "@/components/Modal/Modal";
import NoteBook from "../components/NoteBook";
import ToggleButton from "@/components/Button/ToggleButton";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  return (
    <main
      style={{
        background: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: "99",
        }}
        onClick={() => setDarkMode((v) => !v)}
      >
        <ToggleButton
          isOn={!darkMode}
          rightButton={"☀️"}
          leftButton={"🌙"}
        ></ToggleButton>
      </div>
      <NoteBook />
      <Modal />
    </main>
  );
}
