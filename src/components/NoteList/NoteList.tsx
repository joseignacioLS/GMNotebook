import React, { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./notelist.module.scss";
import { DataContext } from "@/context/data";
import NoteCard from "./NoteCard";
import { referenceI, textPieceI } from "@/context/constants";
import { generateDisplayText, splitTextIntoReferences } from "@/utils/text";

const NoteList = ({}) => {
  const { data, textPieces } = useContext(DataContext);
  const [notes, setNotes] = useState<ReactElement[]>([]);

  useEffect(() => {
    const processedTextPieces: referenceI[] = textPieces
      .filter((v) => v.type === "reference")
      .map((v: textPieceI) => v as referenceI)
      .reduce((acc: referenceI[], curr: referenceI) => {
        if (acc.some((item: referenceI) => item.key === curr.key)) return acc;
        return [...acc, curr];
      }, []);
    setNotes(
      processedTextPieces.map((textPiece: referenceI, i: number) => {
        const showTitle = data[textPiece.key]?.title || "";
        const referenceText = data[textPiece.key]?.text || "";
        const expandable = referenceText.split(" ").length > 30;
        const showText = generateDisplayText(
          splitTextIntoReferences(referenceText),
          true,
          data
        );
        const shortShowText = generateDisplayText(
          splitTextIntoReferences(
            referenceText.split(" ").slice(0, 25).join(" ") + " ..."
          ),
          true,
          data
        );
        return (
          <NoteCard
            key={textPiece.key}
            itemKey={textPiece.key}
            color={textPiece.color}
            title={showTitle}
            text={showText}
            shortText={expandable ? shortShowText : undefined}
            visible={textPiece.visible}
          />
        );
      })
    );
    return () => setNotes([]);
  }, [data, textPieces]);

  return (
    <div className={styles.noteListContainer} id="notes">
      {notes}
    </div>
  );
};

export default NoteList;
