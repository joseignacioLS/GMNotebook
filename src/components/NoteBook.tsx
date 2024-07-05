import React, { useContext, useEffect, useState } from "react";
import NoteList from "./NoteList/NoteList";

import PageEdit from "./Page/PageEdit";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";
import ToggleButton from "./Button/ToggleButton";

import styles from "./notebook.module.scss";
import PageDisplay from "./Page/PageDisplay";
import {
  extractReferences,
  filterReferencesBasedOnVisibility,
} from "@/utils/text";

const NoteBook: React.FC = () => {
  const { editMode, updateEditMode, updateSelectedNote } =
    useContext(DataContext);
  const { path } = useContext(NavigationContext);

  const { item } = useContext(DataContext);
  const [references, setReferences] = useState<{
    total: string[];
    visible: string[];
  }>({
    total: [],
    visible: [],
  });

  const updateReferences = () => {
    const totalReferences = extractReferences(item.text);
    const visibleReferences = filterReferencesBasedOnVisibility(item.text);
    setReferences({ total: totalReferences, visible: visibleReferences });
  };

  useEffect(() => {
    updateReferences();
    document
      .querySelector("#text")
      ?.addEventListener("scroll", updateReferences);
    return () => {
      document
        .querySelector("#text")
        ?.removeEventListener("scroll", updateReferences);
    };
  }, [item.text]);

  return (
    <div
      className={`${styles.notebook} ${
        references.total.length < 1 && !editMode && styles.referenceLess
      }`}
    >
      <PageDisplay />
      {editMode ? <PageEdit /> : <NoteList references={references} />}
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
