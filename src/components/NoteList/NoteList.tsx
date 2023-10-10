import React, { useContext, useEffect, useState } from "react";
import styles from "./notelist.module.scss";
import { DataContext } from "@/context/data";
import NoteCard from "./NoteCard";
import { referenceI, textPieceI } from "@/context/constants";

const NoteList = ({}) => {
  const { data, textPieces, gmMode } = useContext(DataContext);
  const [notes, setNotes] = useState<referenceI[]>([]);

  useEffect(() => {
    const processedTextPieces: referenceI[] = textPieces
      .filter((v) => {
        if (v.type !== "reference") return false;
        const ref = v as referenceI;
        return gmMode || data[ref.key]?.showToPlayers;
      })
      .map((v: textPieceI) => v as referenceI)
      .reduce((acc: referenceI[], curr: referenceI) => {
        if (acc.some((item: referenceI) => item.key === curr.key)) return acc;
        return [...acc, curr];
      }, []);
    setNotes(processedTextPieces);
    return () => setNotes([]);
  }, [data, textPieces]);

  return (
    <div className={styles.noteListContainer} id="notes">
      {notes.map((textPiece: referenceI) => {
        return (
          <NoteCard
            key={textPiece.key}
            itemKey={textPiece.key}
            color={textPiece.color}
            title={data[textPiece.key]?.title || ""}
            text={data[textPiece.key]?.text || ""}
            visible={textPiece.visible}
          />
        );
      })}
    </div>
  );
};

export default NoteList;
