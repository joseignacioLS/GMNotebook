import React, { useState } from "react";
import Page from "./Page/Page";
import NoteList from "./NoteList/NoteList";

import styles from "./notebook.module.scss";
import Conections from "./Conections";
import DataActions from "./DataActions";
import Tutorial from "./Tutorial";
import Button from "./Button/Button";
import PageEdit from "./Page/PageEdit";

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
  const [showNotes, setShowNotes] = useState<boolean>(true);
  return (
    <div className={styles.notebook}>
      <Tutorial />
      <Page />
      <div className={styles.rightColumn}>
        <Button
          naked={true}
          addClass={styles.toggleColumn}
          onClick={() => setShowNotes((v) => !v)}
        >
          {generateToggle(showNotes, "Display", "Edit")}
        </Button>
        {showNotes ? <NoteList /> : <PageEdit />}
      </div>
      <Conections />
      <DataActions />
    </div>
  );
};

export default NoteBook;
