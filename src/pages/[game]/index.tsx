import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { darkModeContext } from "@/context/darkmode";
import { DataContext } from "@/context/data";
import { getRequest } from "@/utils/api";

export default function Home() {
  const { darkMode } = useContext(darkModeContext);
  const { setCredentials, updateData, updateEditMode } =
    useContext(DataContext);
  const router = useRouter();
  const searchParams = useSearchParams();

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
      router.push(`/${game}/RootPage`);
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
    ></main>
  );
}
