import ToggleButton from "@/components/Button/ToggleButton";
import Modal from "@/components/Modal/Modal";
import Welcome from "@/components/Welcome";
import { darkModeContext } from "@/context/darkmode";
import { useContext, useState } from "react";

export default function Home() {
  const { darkMode, toggleDarkMode } = useContext(darkModeContext);

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
        onClick={toggleDarkMode}
      >
        <ToggleButton
          isOn={darkMode}
          leftButton={<img src="/images/sun.svg" />}
          rightButton={<img src="/images/moon.svg" />}
        ></ToggleButton>
      </div>
      <Welcome />
      <Modal />
    </main>
  );
}
