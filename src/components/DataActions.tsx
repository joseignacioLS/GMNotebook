import React, { useContext } from "react";
import styles from "./dataactions.module.scss";
import { loadFile, saveToFile } from "@/utils/file";
import { DataContext } from "@/context/data";

const DataActions = () => {
  const { updateData, data, resetData } = useContext(DataContext);
  return (
    <div className={styles.dataActions}>
      <button
        className="button"
        id="btn-reset"
        data-tip={"Reset"}
        onClick={resetData}
      >
        <img src="/images/reset.svg" />
      </button>
      <input
        data-tip={"Upload"}
        type="file"
        id="file"
        onChange={() => {
          loadFile("#file", updateData);
        }}
      />
      <button
        data-tip={"Download"}
        id="btn-download"
        className="button"
        onClick={() =>
          saveToFile(data["RootPage"].title.replace(/ /g, "-"), data)
        }
      >
        <img src="/images/download.svg" />
      </button>
    </div>
  );
};

export default DataActions;
