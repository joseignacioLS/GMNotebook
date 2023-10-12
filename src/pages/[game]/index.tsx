import Modal from "@/components/Modal/Modal";
import ToggleButton from "@/components/Button/ToggleButton";
import { useContext, useEffect, useState } from "react";
import NoteBook from "@/components/NoteBook";
import { games } from "@/data/games";
import { DataContext } from "@/context/data";
import { useRouter } from "next/router";

export default function Home() {
  const { updateData } = useContext(DataContext);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const game = router.query.game as string;
    if (games[game] !== undefined) {
      updateData(games[game], true);
    } else if (game !== undefined) {
      router.push("/");
    }
  }, [games, router]);

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