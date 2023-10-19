import Modal from "@/components/Modal/Modal";
import ToggleButton from "@/components/Button/ToggleButton";
import { useContext, useEffect, useState } from "react";
import NoteBook from "@/components/NoteBook";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { getRequest } from "@/utils/api";
import { DataContext } from "@/context/data";
import Button from "@/components/Button/Button";
import LoginForm from "@/components/Forms/LoginForm/LoginForm";
import { modalContext } from "@/context/modal";

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateData, gmMode, setGmMode, setGameName, updateEditMode } =
    useContext(DataContext);
  const { setContent } = useContext(modalContext);

  const getDataFromServer = async () => {
    const game = searchParams.get("game");
    if (game === null) return;
    const data = await getRequest(`${game}`);
    if (data === null) {
      router.push("/");
    } else {
      setGameName(game);
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
