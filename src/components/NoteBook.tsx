import React, { useContext } from "react";
import Page from "./Page/Page";
import NoteList from "./NoteList/NoteList";

import Button from "./Button/Button";
import PageEdit from "./Page/PageEdit";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";
import ToggleButton from "./Button/ToggleButton";

import styles from "./notebook.module.scss";

const NoteBook = () => {
  const { editMode, updateEditMode, updateSelectedNote } =
    useContext(DataContext);
  const { path } = useContext(NavigationContext);

  return (
    <div className={styles.notebook}>
      <Page />
      <div className={styles.rightColumn}>
        <div className={styles.editButtonToggle}>
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
              leftButton={
                <span className={styles["material-symbols-outlined"]}>
                  local_library
                </span>
              }
              rightButton={
                <span className={styles["material-symbols-outlined"]}>
                  Edit
                </span>
              }
            />
          </Button>
        </div>
        {editMode ? <PageEdit /> : <NoteList />}
      </div>
    </div>
  );
};

export default NoteBook;
