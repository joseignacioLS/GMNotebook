import React, { useContext } from "react";
import Page from "./Page/Page";
import NoteList from "./NoteList/NoteList";

import styles from "./notebook.module.scss";
import Button from "./Button/Button";
import PageEdit from "./Page/PageEdit";
import { DataContext } from "@/context/data";
import ToggleButton from "./Button/ToggleButton";
import ActionButtons from "./ActionButtons";

const NoteBook = () => {
  const { gmMode, updateEditMode, editMode, updateSelectedNote } =
    useContext(DataContext);
  const { currentPage } = useContext(DataContext);

  return (
    <div className={styles.notebook}>
      <div className={styles.leftColumn}>
        <Page />
      </div>
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
      <ActionButtons />
    </div>
  );
};

export default NoteBook;
