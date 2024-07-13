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

const DataActions: React.FC = () => {
  const { data, resetData, updateFileHandle, canEdit } =
    useContext(DataContext);
  const { setContent } = useContext(modalContext);
  const { showToastSuccess } = useContext(toastContext);

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

  const handleUpdatePalette = () => {
    setContent(<ModalPalette />);
  };

  const handleShare = () => {
    const compressData = LZString.compressToEncodedURIComponent(
      JSON.stringify(data)
    );
    navigator.clipboard.writeText(
      `${window.location.origin }?data=${compressData}`
    );
    showToastSuccess("Link copied to clipboard");
  };

  const handleLoad = async (e: any) => {
    e.preventDefault();
    const fileHandle = await getFileHandle();
    updateFileHandle(fileHandle);
  };

  if (!canEdit)
    return (
      <div className={styles.dataActions} data-items="1">
        <Button naked={true} onClick={handleUpdatePalette}>
          <span className={styles["material-symbols-outlined"]}>palette</span>
        </Button>
      </div>
    );
  // TODO: hover not working!
  return (
    <div className={styles.dataActions} data-items="6">
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
