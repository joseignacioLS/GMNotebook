import React, { useContext } from "react";
import Page from "./Page/Page";
import NoteList from "./NoteList/NoteList";

import styles from "./notebook.module.scss";
import Conections from "./Conections";
import DataActions from "./DataActions";
import Tutorial from "./Tutorial";
import Button from "./Button/Button";
import PageEdit from "./Page/PageEdit";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";
import ToggleButton from "./Button/ToggleButton";

const NoteBook = () => {
  const { updateEditMode, editMode, updateSelectedNote, gmMode } =
    useContext(DataContext);
  const { path } = useContext(NavigationContext);

  return (
    <div className={styles.notebook}>
      <Tutorial />
      <Page />
      <div className={styles.rightColumn}>
        {gmMode && (
          <ToggleButton
            isOn={editMode}
            leftButton={<img src="/images/book.svg" />}
            rightButton={<img src="/images/edit.svg" />}
            onClick={() => {
              if (editMode) {
                updateSelectedNote(path.at(-1));
              }
              updateEditMode((v: boolean) => !v);
            }}
          />
        )}
        {editMode ? <PageEdit /> : <NoteList />}
      </div>
      <Conections />
      <DataActions />
    </div>
  );
};

export default NoteBook;
