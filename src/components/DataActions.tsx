import React, { useContext } from "react";
import styles from "./dataactions.module.scss";
import { getFileHandle, saveToFile } from "@/utils/file";
import { DataContext } from "@/context/data";
import { modalContext } from "@/context/modal";
import Tree from "./Tree";
import Button, { behaviourEnum } from "./Button/Button";
import ModalTemplateConfirm from "./Modal/ModalDefaults/ModalTemplateConfirm";
import ModalPalette from "./Modal/ModalDefaults/ModalPalette";
import LZString from "lz-string";
import { toastContext } from "@/context/toast";
import { ModalShare } from "./Modal/ModalDefaults/ModalShare";

const DataActions: React.FC = () => {
  const { data, resetData, updateFileHandle, canEdit } =
    useContext(DataContext);
  const { setContent, closeModal } = useContext(modalContext);
  const { showToastError } = useContext(toastContext);

  const openModalReset = () => {
    setContent(
      <ModalTemplateConfirm
        positiveButtonAction={resetData}
        positiveButtonText={"Reset"}
      >
        <span className="text paragraph">
          Resetting the notebook will erase all your content. If you want to
          keep it, please{" "}
          <Button
            behaviour={behaviourEnum.POSITIVE}
            onClick={() => saveToFile(data["RootPage"].title, data)}
          >
            Download
          </Button>{" "}
          it before resetting.
        </span>
      </ModalTemplateConfirm>
    );
  };

  const handleUpdatePalette = () => {
    setContent(<ModalPalette />);
  };

  const handleShare = () => {
    setContent(<ModalShare />, false);
  };

  const handleGoHome = () => {
    setContent(
      <>
        <p>Are you sure you want to leave this notebook?</p>
        <Button
          onClick={() => {
            closeModal();
            resetData();
          }}
        >
          Confirm
        </Button>
      </>
    );
  };

  const handleLoad = async (e: any) => {
    e.preventDefault();
    try {
      const fileHandle = await getFileHandle();
      updateFileHandle(fileHandle);
    } catch (err) {
      showToastError("There was an error with file handling");
    }
  };

  if (!canEdit)
    return (
      <div className={`${styles.dataActions} ${styles.grow_2}`}>
        <div className={styles.helper}>
          <Button naked={true} onClick={handleGoHome}>
            <span className={styles["material-symbols-outlined"]}>home</span>
          </Button>
          <Button naked={true} onClick={handleUpdatePalette}>
            <span className={styles["material-symbols-outlined"]}>palette</span>
          </Button>
        </div>
      </div>
    );
  return (
    <div className={`${styles.dataActions} ${styles.grow_6}`} data-items="6">
      <div className={styles.helper}>
        <Button naked={true} onClick={handleShare}>
          <span className={styles["material-symbols-outlined"]}>share</span>
        </Button>
        <Button naked={true} onClick={handleUpdatePalette}>
          <span className={styles["material-symbols-outlined"]}>palette</span>
        </Button>
        <Button naked={true} onClick={openModalReset}>
          <span className={styles["material-symbols-outlined"]}>history</span>
        </Button>
        <Button naked={true} onClick={() => setContent(<Tree />)}>
          <span className={styles["material-symbols-outlined"]}>
            network_node
          </span>
        </Button>
        <Button
          naked={true}
          onClick={() => saveToFile(data["RootPage"].title, data)}
        >
          <span className={styles["material-symbols-outlined"]}>download</span>
        </Button>
        <Button onClick={() => {}} naked={true}>
          <input
            data-tip={"Upload"}
            type="file"
            id="file"
            onClick={(e: any) => {
              handleLoad(e);
            }}
          ></input>
        </Button>
      </div>
    </div>
  );
};

export default DataActions;
