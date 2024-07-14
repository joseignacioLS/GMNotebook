"use client";

import Modal from "@/components/Modal/Modal";
import NoteBook from "../components/NoteBook";
import DataActions from "@/components/DataActions";

import { useContext } from "react";
import { colorContext } from "@/context/colors";
import Toast from "@/components/Toast/Toast";
import Loading from "@/components/Loading/Loading";

export default function Home() {
  const { darkMode } = useContext(colorContext);

  return (
    <main className={darkMode ? "dark" : "white"}>
      <NoteBook />
      <Modal />
      <DataActions />
      <Toast />
      <Loading />
    </main>
  );
}
