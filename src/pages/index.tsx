import Modal from "@/components/Modal/Modal";
import NoteBook from "../components/NoteBook";
import ToggleButton from "@/components/Button/ToggleButton";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/data";

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { setGmMode } = useContext(DataContext);

  useEffect(() => {
    setGmMode(true);
  }, []);
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
          zIndex: "10",
        }}
        onClick={() => setDarkMode((v) => !v)}
      >
        <ToggleButton
          isOn={darkMode}
          leftButton={<img src="/images/sun.svg" />}
          rightButton={<img src="/images/moon.svg" />}
        ></ToggleButton>
      </div>
      <NoteBook />
      <Modal />
    </main>
  );
}
