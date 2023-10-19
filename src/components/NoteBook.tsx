import React, { useContext } from "react";
import Page from "./Page/Page";
import NoteList from "./NoteList/NoteList";

import styles from "./notebook.module.scss";
import DataActions from "./DataActions";
import Button from "./Button/Button";
import PageEdit from "./Page/PageEdit";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";
import ToggleButton from "./Button/ToggleButton";
import { modalContext } from "@/context/modal";
import { darkModeContext } from "@/context/darkmode";
import MiniLogin from "./Forms/MiniLogin/MiniLogin";

const NoteBook = () => {
  const { darkMode, toggleDarkMode } = useContext(darkModeContext);
  const { gmMode, updateEditMode, editMode, updateSelectedNote } =
    useContext(DataContext);
  const { setContent } = useContext(modalContext);
  const { path } = useContext(NavigationContext);

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
                updateSelectedNote(path.at(-1));
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "1rem",
          paddingTop: "1rem",
        }}
      >
        <ToggleButton
          isOn={darkMode}
          leftButton={<img src="/images/sun.svg" />}
          rightButton={<img src="/images/moon.svg" />}
          onClick={toggleDarkMode}
        ></ToggleButton>
        <MiniLogin />
      </div>
      {gmMode && <DataActions />}
    </div>
  );
};

export default NoteBook;
