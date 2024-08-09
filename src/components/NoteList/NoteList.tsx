import React, { ReactNode } from "react";
import styles from "./notelist.module.scss";
import NoteCard from "./NoteCard";

interface IProps {
  references: { total: string[]; visible: string[] };
}

const generateVisibleNotes = (references: IProps["references"]) => {
  return references.total.reduce(
    (acc: { shown: string[]; notes: ReactNode[] }, reference: string) => {
      const noteKey = reference.split("_")[0];
      const isVisible =
        !acc.shown.includes(noteKey) && references.visible.includes(reference);
      if (isVisible) {
        acc.shown.push(noteKey);
      }
      const noteId = isVisible ? noteKey : undefined;
      acc.notes.push(
        <NoteCard
          key={reference}
          itemKey={reference}
          noteId={noteId}
          visible={isVisible}
        />
      );
      return acc;
    },
    { shown: [], notes: [] }
  ).notes;
};

const NoteList: React.FC<IProps> = ({ references }) => {
  return (
    <div className={styles.noteListContainer} id="notes">
      {generateVisibleNotes(references)}
    </div>
  );
};

export default NoteList;
