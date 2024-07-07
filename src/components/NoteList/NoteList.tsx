import React, { ReactNode, useEffect, useState } from "react";
import styles from "./notelist.module.scss";
import NoteCard from "./NoteCard";

interface IProps {
  references: { total: string[]; visible: string[] };
}

const NoteList: React.FC<IProps> = ({ references }) => {
  const [visibleNotes, setVisibleNotes] = useState<ReactNode[]>([]);

  const updateVisibleNotes = (visibleNoteKeys: string[]) => {
    const newVisibleNotes = references.total.reduce(
      (acc: { shown: string[]; notes: ReactNode[] }, reference: string) => {
        const noteKey = reference.split("_")[0];
        const isVisible =
          !acc.shown.includes(noteKey) && visibleNoteKeys.includes(noteKey);
        if (isVisible) {
          acc.shown.push(noteKey);
        }
        acc.notes.push(
          <NoteCard key={reference} itemKey={reference} visible={isVisible} />
        );
        return acc;
      },
      { shown: [], notes: [] }
    ).notes;
    setVisibleNotes(newVisibleNotes);
  };

  useEffect(() => {
    const visibleNoteKeys = references.visible.map((r) => r.split("_")[0]);
    updateVisibleNotes(visibleNoteKeys);
  }, [references.visible]);

  return (
    <div className={styles.noteListContainer} id="notes">
      {visibleNotes}
    </div>
  );
};

export default NoteList;
