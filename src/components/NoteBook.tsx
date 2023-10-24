import React, { useContext } from "react";
import Page from "./Page/Page";
import NoteList from "./NoteList/NoteList";

import styles from "./notebook.module.scss";
import Button, { behaviourEnum } from "./Button/Button";
import PageEdit from "./Page/PageEdit";
import { DataContext } from "@/context/data";
import ToggleButton from "./Button/ToggleButton";
import { darkModeContext } from "@/context/darkmode";
import MiniLogin from "./Forms/MiniLogin/MiniLogin";
import { loadFile, saveToFile } from "@/utils/file";

const NoteBook = () => {
  const { darkMode, toggleDarkMode } = useContext(darkModeContext);
  const {
    data,
    updateData,
    gmMode,
    updateEditMode,
    editMode,
    updateSelectedNote,
    updatedWithServer,
  } = useContext(DataContext);
  const { currentPage } = useContext(DataContext);

  return (
    <div className={styles.notebook}>
      <Page />
      <div className={styles.rightColumn}>
        {gmMode && (
          <Button
            naked={true}
            addClass={styles.toggleColumn}
            onClick={() => {
              if (editMode) {
                updateSelectedNote(currentPage);
              }
              updateEditMode((v: boolean) => !v);
            }}
          >
            <ToggleButton
              isOn={editMode}
              leftButton={<img src="/images/book.svg" />}
              rightButton={<img src="/images/edit.svg" />}
            />
          </Button>
        )}
        {editMode ? <PageEdit /> : <NoteList />}
      </div>
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
              updatedWithServer
                ? behaviourEnum.POSITIVE
                : behaviourEnum.NEGATIVE
            }
          >
            <img
              src={`/images/${updatedWithServer ? "synced" : "unsynced"}.svg`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteBook;
