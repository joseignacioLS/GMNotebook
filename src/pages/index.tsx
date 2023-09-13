import NotePage from "../components/NotePage";
import { DataContext } from "@/context/data";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const { asPath } = useRouter();
  const { data } = useContext(DataContext);
  const [entry, setEntry] = useState<any>([]);
  useEffect(() => {
    setEntry({});
    setTimeout(() => setEntry(data[asPath.replace("/#", "")] || undefined), 0);
  }, [asPath, data]);
  return (
    <main>
      <NotePage item={{ ...entry }} />
    </main>
  );
}
