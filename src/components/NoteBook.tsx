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
import { Tabs } from "./Tabs/Tabs";

const MINIMUM_COL_SIZE = 300;
const DRAG_CORRECTION = 30;

const NoteBook: React.FC = () => {
  const { editMode, updateEditMode, updateSelectedNote, canEdit } =
    useContext(DataContext);
  const { path } = useContext(NavigationContext);
  const [screenWidth, setScreenWidth] = useState(0);
  const [rightColumnSize, setRightColumnSize] = useState(0);
  const [dragging, setDragging] = useState(false);

  const { item } = useContext(DataContext);
  const [references, setReferences] = useState<{
    total: string[];
    visible: string[];
  }>({
    total: [],
    visible: [],
  });

  const handleDragStart = () => {
    setDragging(true);
  };
  const handleDragEnd = () => {
    setDragging(false);
  };
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.stopPropagation();
    e.preventDefault();
    const { clientX } = e;
    const width = screenWidth;
    const columnSize = width - clientX;
    if (
      clientX > 0 &&
      columnSize > MINIMUM_COL_SIZE &&
      columnSize < width - MINIMUM_COL_SIZE
    ) {
      setRightColumnSize(width - clientX - DRAG_CORRECTION);
    }
  };

  useEffect(() => {
    const updateWindowWidth = () => {
      setScreenWidth(window.innerWidth);
      if (rightColumnSize === 0) {
        setRightColumnSize(window.innerWidth / 2);
      }
    };
    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  useEffect(() => {
    const updateReferences = () => {
      const totalReferences = extractReferences(item.text);
      const visibleReferences = filterReferencesBasedOnVisibility(
        item.text,
        canEdit
      );
      setReferences({ total: totalReferences, visible: visibleReferences });
    };
    updateReferences();
    document
      .querySelector("#text")
      ?.addEventListener("scroll", updateReferences);
    return () => {
      document
        .querySelector("#text")
        ?.removeEventListener("scroll", updateReferences);
    };
  }, [item.text, canEdit]);

  return (
    <div
      className={`${styles.notebook} ${
        references.total.length < 1 && !editMode && styles.referenceLess
      }`}
      style={{
        gridTemplateColumns:
          screenWidth > 800 ? `1fr auto ${rightColumnSize}px` : "100%",
      }}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
    >
      <PageDisplay />
      <div className={styles.draggable} onMouseDown={handleDragStart} />
      {editMode ? <PageEdit /> : <NoteList references={references} />}
      {canEdit && (
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
      )}
      {canEdit && <Tabs />}
    </div>
  );
};

export default NoteBook;
