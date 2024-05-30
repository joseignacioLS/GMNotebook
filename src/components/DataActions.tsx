import React, { useContext, useState } from "react";
import styles from "./dataactions.module.scss";
import { getFileHandle, loadFile, saveToFile } from "@/utils/file";
import { DataContext } from "@/context/data";
import { modalContext } from "@/context/modal";
import Tree from "./Tree";
import Button, { behaviourEnum } from "./Button/Button";
import ModalTemplateConfirm from "./Modal/ModalDefaults/ModalTemplateConfirm";

const DataActions = () => {
  const { updateData, data, resetData, setFileHandle } =
    useContext(DataContext);
  const { setContent } = useContext(modalContext);

  const openModalReset = () => {
    setContent(
      <ModalTemplateConfirm
        positiveButtonAction={resetData}
        positiveButtonText={"Reset"}
      >
        <p>
          Resetting the notebook will erase all your content. If you want to
          keep it, please{" "}
          <Button
            behaviour={behaviourEnum.POSITIVE}
            onClick={() => saveToFile(data["RootPage"].title, data)}
          >
            Download
          </Button>{" "}
          it before resetting.
        </p>
      </ModalTemplateConfirm>
    );
  };

  const handleLoad = async (e: any) => {
    e.preventDefault();
    const fileHandle = await getFileHandle();
    setFileHandle(fileHandle);
    const file = await fileHandle.getFile();
    const text = await file.text();
    updateData(JSON.parse(text) as any, true);
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
        onClick={(e: any) => {
          handleLoad(e);
          // loadFile("#file", updateData);
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
