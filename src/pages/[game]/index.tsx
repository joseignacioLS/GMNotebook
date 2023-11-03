import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { darkModeContext } from "@/context/darkmode";

export default function Home() {
  const { darkMode } = useContext(darkModeContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const game = searchParams.get("game");
    router.push(`/${game}/RootPage`);
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
