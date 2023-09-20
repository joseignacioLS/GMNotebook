import React, { useContext } from "react";
import Page from "./Page";
import NoteList from "./NoteList";

import styles from "./notebook.module.scss";
import { DataContext } from "@/context/data";
import Conections from "./Conections";
import { loadFile, saveToFile } from "@/utils/file";

const NoteBook = () => {
  const { data, item, updateData, resetData } = useContext(DataContext);

  return (
    <div className={styles.notebook}>
      {item && (
        <>
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
        </>
      )}{" "}
      <div className={styles.buttons}>
        <input
          type="file"
          id="file"
          onChange={() => {
            loadFile("#file", updateData);
          }}
        />
        <button
          id="btn-download"
          className="button"
          onClick={() => saveToFile("data.json", data)}
        >
          <img src="/images/download.svg" />
        </button>
        <button className="button" id="btn-reset" onClick={resetData}>
          <img src="/images/reset.svg" />
        </button>
      </div>
    </div>
  );
};

export default NoteBook;
