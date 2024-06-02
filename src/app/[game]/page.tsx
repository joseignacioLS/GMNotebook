"use client";

import Modal from "@/components/Modal/Modal";
import ToggleButton from "@/components/Button/ToggleButton";
import { useContext, useEffect, useState } from "react";
import NoteBook from "@/components/NoteBook";
import { games } from "@/data/games";
import { DataContext } from "@/context/data";
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: any }) {
  const { updateData } = useContext(DataContext);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const router = useRouter();
  console.log(params);

  useEffect(() => {
    const { game } = params;
    console.log(game);
    if (games[game] !== undefined) {
      updateData(games[game], true);
    } else if (game !== undefined) {
      router.push("/");
    }
  }, [games, router]);

  return (
    <main className={darkMode ? "dark" : "white"}>
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
