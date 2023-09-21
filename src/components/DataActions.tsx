import React, { useContext } from "react";
import styles from "./dataactions.module.scss";
import { loadFile, saveToFile } from "@/utils/file";
import { DataContext } from "@/context/data";

const DataActions = () => {
  const { updateData, data, resetData } = useContext(DataContext);
  return (
    <div className={styles.dataActions}>
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
  );
};

export default DataActions;
