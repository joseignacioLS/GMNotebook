import React, { useContext } from "react";
import styles from "./actionbuttons.module.scss";
import ToggleButton from "./Button/ToggleButton";
import MiniLogin from "./Forms/MiniLogin/MiniLogin";
import Button, { behaviourEnum } from "./Button/Button";
import { darkModeContext } from "@/context/darkmode";
import { DataContext } from "@/context/data";
import { loadFile, saveToFile } from "@/utils/file";

const ActionButtons = () => {
  const { darkMode, toggleDarkMode } = useContext(darkModeContext);
  const { data, updateData, gmMode, updatedWithServer } =
    useContext(DataContext);
  return (
    <div className={styles.actionButtons}>
      <ToggleButton
        isOn={darkMode}
        leftButton={<img src="/images/sun.svg" />}
        rightButton={<img src="/images/moon.svg" />}
        onClick={toggleDarkMode}
      ></ToggleButton>
      <MiniLogin />
      {gmMode && (
        <Button onClick={() => {}}>
          <input
            data-tip={"Upload"}
            type="file"
            id="file"
            onChange={() => {
              loadFile("#file", updateData);
            }}
          />
        </Button>
      )}
      {gmMode && (
        <Button onClick={() => saveToFile(data["RootPage"].title, data)}>
          <img src="/images/download.svg" />
        </Button>
      )}
      <div
        style={{
          gridColumn: "5/6",
        }}
      >
        <Button
          onClick={() => {}}
          behaviour={
            updatedWithServer ? behaviourEnum.POSITIVE : behaviourEnum.NEGATIVE
          }
        >
          <img
            src={`/images/${updatedWithServer ? "synced" : "unsynced"}.svg`}
          />
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
