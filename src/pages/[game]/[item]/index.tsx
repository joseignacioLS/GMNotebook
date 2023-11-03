import Modal from "@/components/Modal/Modal";
import { useContext, useEffect } from "react";
import NoteBook from "@/components/NoteBook";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { DataContext } from "@/context/data";
import { darkModeContext } from "@/context/darkmode";

export default function Home() {
  const { darkMode } = useContext(darkModeContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { gameName, updateEditMode, retrieveDataFromServer } =
    useContext(DataContext);

  const getDataFromServer = async () => {
    const game = searchParams.get("game");
    const item = searchParams.get("item") || "RootPage";
    retrieveDataFromServer(game, item);
  };

  useEffect(() => {
    getDataFromServer();
    updateEditMode(false);
  }, [router, gameName]);

  return (
    <main
      style={{
        background: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      <NoteBook />
      <Modal />
    </main>
  );
}
