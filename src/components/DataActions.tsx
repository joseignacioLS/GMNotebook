import React, { useContext } from "react";
import styles from "./dataactions.module.scss";
import { loadFile, saveToFile } from "@/utils/file";
import { DataContext } from "@/context/data";
import { modalContext } from "@/context/modal";

const DataActions = () => {
  const { updateData, data, resetData } = useContext(DataContext);
  const { setContent, closeModal } = useContext(modalContext);

  const openModalReset = () => {
    setContent(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <p>Resetting the notebook will erase all your content.</p>
        <p>
          If you want to keep it, please{" "}
          <button
            className="button"
            style={{
              backgroundColor: "aquamarine",
              padding: ".5rem 1rem",
              borderRadius: ".5rem",
            }}
            onClick={() => saveToFile(data["RootPage"].title, data)}
          >
            Download
          </button>{" "}
          it before resetting.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          {" "}
          <button
            className="button"
            style={{
              backgroundColor: "lightgrey",
              padding: ".5rem 1rem",
              borderRadius: ".5rem",
            }}
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="button"
            style={{
              backgroundColor: "lightcoral",
              padding: ".5rem 1rem",
              borderRadius: ".5rem",
            }}
            onClick={() => {
              resetData();
              closeModal();
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className={styles.dataActions}>
      <button
        className="button"
        id="btn-reset"
        data-tip={"Reset"}
        onClick={openModalReset}
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
        onClick={() => saveToFile(data["RootPage"].title, data)}
      >
        <img src="/images/download.svg" />
      </button>
    </div>
  );
};

export default DataActions;
