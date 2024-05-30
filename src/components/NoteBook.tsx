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

const NoteBook = () => {
  const { editMode, updateEditMode, updateSelectedNote } =
    useContext(DataContext);
  const { path } = useContext(NavigationContext);

  return (
    <div className={styles.notebook}>
      <Page />
      <div className={styles.rightColumn}>
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
        {editMode ? <PageEdit /> : <NoteList />}
      </div>
      <DataActions />
    </div>
  );
};

export default NoteBook;
