"use client";

import Modal from "@/components/Modal/Modal";
import NoteBook from "../components/NoteBook";
import DataActions from "@/components/DataActions";

import { Suspense, useContext, useEffect } from "react";
import { colorContext } from "@/context/colors";
import Toast from "@/components/Toast/Toast";
import Loading from "@/components/Loading/Loading";
import { useSearchParams } from "next/navigation";
import { loadingContext } from "@/context/loading";
import { DataContext } from "@/context/data";

const DataRetriever = () => {
  const { setShow: setShowLoading } = useContext(loadingContext);
  const { getDataFromRemote } = useContext(DataContext);

  const searchParams = useSearchParams();
  const remoteData = searchParams.get("data");

  useEffect(() => {
    if (!remoteData) return setShowLoading(false);
    getDataFromRemote(remoteData);
  }, [remoteData]);
  return <></>;
};

export default function Home() {
  const { darkMode } = useContext(colorContext);
  return (
    <main className={darkMode ? "dark" : "white"}>
      <Suspense>
        <DataRetriever />
      </Suspense>
      <NoteBook />
      <Modal />
      <DataActions />
      <Toast />
      <Loading />
    </main>
  );
}
