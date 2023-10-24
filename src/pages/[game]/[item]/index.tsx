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
    setSelectedNote,
    updateEditMode,
  } = useContext(DataContext);

  const getDataFromServer = async () => {
    const game = searchParams.get("game");
    if (!game) return;
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
    const item = searchParams.get("item") || "RootPage";
    setCurrentPage(item);
    setSelectedNote(item);
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
