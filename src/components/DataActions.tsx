import React, { useContext } from "react";
import styles from "./dataactions.module.scss";
import { loadFile, saveToFile } from "@/utils/file";
import { DataContext } from "@/context/data";
import { modalContext } from "@/context/modal";
import Tree from "./Tree";
import Button, { behaviourEnum } from "./Button/Button";

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
          <Button
            behaviour={behaviourEnum.POSITIVE}
            onClick={() => saveToFile(data["RootPage"].title, data)}
          >
            Download
          </Button>{" "}
          it before resetting.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Button behaviour={behaviourEnum.NEUTRAL} onClick={closeModal}>
            Close
          </Button>
          <Button
            behaviour={behaviourEnum.NEGATIVE}
            onClick={() => {
              resetData();
              closeModal();
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div className={styles.dataActions}>
      <Button naked={true} onClick={openModalReset}>
        <img src="/images/reset.svg" />
      </Button>
      <Button naked={true} onClick={() => setContent(<Tree />)}>
        <img src="/images/tree.svg" />
      </Button>
      <input
        data-tip={"Upload"}
        type="file"
        id="file"
        onChange={() => {
          loadFile("#file", updateData);
        }}
      />
      <Button
        naked={true}
        onClick={() => saveToFile(data["RootPage"].title, data)}
      >
        <img src="/images/download.svg" />
      </Button>
    </div>
  );
};

export default DataActions;
