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
  const { updateData, setCredentials } = useContext(DataContext);

  const getDataFromServer = async () => {
    const game = searchParams.get("game");
    if (game === null) return;
    const data = await getRequest(`${game}`);
    if (data === null) {
      router.push("/");
    } else {
      setCredentials((v: any) => {
        return { ...v, gameName: game };
      });
      updateData(JSON.parse(data), true);
    }
  };

  useEffect(() => {
    getDataFromServer();
  }, [router]);

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
