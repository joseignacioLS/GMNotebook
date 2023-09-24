import React, { useContext, useEffect, useState } from "react";
import Page from "./Page/Page";
import NoteList from "./NoteList/NoteList";

import styles from "./notebook.module.scss";
import Conections from "./Conections";
import DataActions from "./DataActions";
import Tutorial from "./Tutorial";
import Button from "./Button/Button";
import PageEdit from "./Page/PageEdit";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";

const generateToggle = (
  isOn: boolean,
  optionA: string = "",
  optionB: string = ""
) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        gap: ".5rem",
        alignItems: "center",
      }}
    >
      <span style={{ opacity: isOn ? "1" : ".25" }}>{optionA}</span>
      <div
        style={{
          position: "relative",
          width: "4rem",
          height: "2rem",
          backgroundColor: "lightgrey",
          borderRadius: "1.5rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "2rem",
            height: "2rem",
            backgroundColor: "darkgrey",
            borderRadius: "50%",
            transform: !isOn ? "translateX(2rem)" : "translateX(0px)",
            transition: "transform .3s",
          }}
        ></div>
      </div>
      <span style={{ opacity: !isOn ? "1" : ".25" }}>{optionB}</span>
    </div>
  );
};

const NoteBook = () => {
  const { setEditMode, editMode, setSelectedNote } = useContext(DataContext);
  const { path } = useContext(NavigationContext);

  useEffect(() => {
    setEditMode(false);
  }, [path]);
  return (
    <div className={styles.notebook}>
      <Tutorial />
      <Page />
      <div className={styles.rightColumn}>
        <Button
          naked={true}
          addClass={styles.toggleColumn}
          onClick={() => {
            if (editMode) {
              setSelectedNote(path.at(-1));
            }
            setEditMode((v: boolean) => !v);
          }}
        >
          {generateToggle(!editMode, "Display", "Edit")}
        </Button>
        {editMode ? <PageEdit /> : <NoteList />}
      </div>
      <Conections />
      <DataActions />
    </div>
  );
};

export default NoteBook;
