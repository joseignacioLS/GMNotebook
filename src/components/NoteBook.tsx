import React, { useContext } from "react";
import NoteList from "./NoteList/NoteList";

import PageEdit from "./Page/PageEdit";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";
import ToggleButton from "./Button/ToggleButton";

import styles from "./notebook.module.scss";
import PageDisplay from "./Page/PageDisplay";

const NoteBook: React.FC = () => {
  const { editMode, updateEditMode, updateSelectedNote } =
    useContext(DataContext);
  const { path } = useContext(NavigationContext);

  return (
    <div className={styles.notebook}>
      <PageDisplay />
      {editMode ? <PageEdit /> : <NoteList />}
      <div className={styles.editButtonToggle}>
        <ToggleButton
          onClick={() => {
            if (editMode) {
              updateSelectedNote(path.at(-1));
            }
            updateEditMode((v: boolean) => !v);
          }}
          isOn={editMode}
          leftButton={
            <span className={styles["material-symbols-outlined"]}>
              local_library
            </span>
          }
          rightButton={
            <span className={styles["material-symbols-outlined"]}>Edit</span>
          }
        />
      </div>
    </div>
  );
};

export default NoteBook;
