import React from "react";
import Page from "./Page/Page";
import NoteList from "./NoteList/NoteList";

import styles from "./notebook.module.scss";
import Conections from "./Conections";
import DataActions from "./DataActions";
import Tutorial from "./Tutorial";

const NoteBook = () => {
  return (
    <div className={styles.notebook}>
      <Tutorial />
      <Page />
      <div
        style={{
          height: "100%",
          width: "1px",
          backgroundColor: "black",
          gridArea: "sep",
        }}
      ></div>
      <NoteList />
      <Conections />
      <DataActions />
    </div>
  );
};

export default NoteBook;
