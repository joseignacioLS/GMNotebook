import React, { useContext } from "react";
import styles from "./dataactions.module.scss";
import { getFileHandle, saveToFile } from "@/utils/file";
import { DataContext } from "@/context/data";
import { modalContext } from "@/context/modal";
import Tree from "./Tree";
import Button, { behaviourEnum } from "./Button/Button";
import ModalTemplateConfirm from "./Modal/ModalDefaults/ModalTemplateConfirm";

interface IProps {
  darkMode: boolean;
  setDarkMode: any;
}

const DataActions: React.FC<IProps> = ({ darkMode, setDarkMode }) => {
  const { updateData, data, resetData, updateFileHandle } =
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
    updateFileHandle(fileHandle);
  };

  return (
    <div className={styles.dataActions}>
      <div className={styles.helper}>
        <Button
          naked={true}
          onClick={() => {
            setDarkMode((state: boolean) => !state);
          }}
        >
          <span className={styles["material-symbols-outlined"]}>
            {darkMode ? "dark_mode" : "light_mode"}
          </span>
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
        <input
          data-tip={"Upload"}
          type="file"
          id="file"
          onClick={(e: any) => {
            handleLoad(e);
          }}
        ></input>
      </div>
    </div>
  );
};

export default DataActions;
