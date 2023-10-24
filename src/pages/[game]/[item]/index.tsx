import Modal from "@/components/Modal/Modal";
import { useContext, useEffect } from "react";
import NoteBook from "@/components/NoteBook";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { getRequest } from "@/utils/api";
import { DataContext } from "@/context/data";
import { darkModeContext } from "@/context/darkmode";

export default function Home() {
  const { darkMode } = useContext(darkModeContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    gameName,
    updateData,
    setCredentials,
    setCurrentPage,
    updateSelectedNote,
    updateEditMode,
    gmMode,
    data,
  } = useContext(DataContext);

  const getDataFromServer = async () => {
    const game = searchParams.get("game");
    if (!game || !data) return;
    if (game !== gameName) {
      const data = await getRequest(`${game}`);
      if (data === null) {
        router.push("/");
      } else {
        updateEditMode(false);
        updateData(JSON.parse(data), false);
        setCredentials((v: any) => {
          return { ...v, gameName: game };
        });
      }
    }
    const item = searchParams.get("item") || "RootPage";
    if (!gmMode && !data[item]?.showToPlayers) {
      router.push(`/${game}/RootPage`);
    } else {
      setCurrentPage(item);
      updateSelectedNote(item);
    }
    updateEditMode(false);
  };

  useEffect(() => {
    getDataFromServer();
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
