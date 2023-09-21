import React, { useContext } from "react";
import styles from "./notelist.module.scss";
import { DataContext } from "@/context/data";
import NoteCard from "./NoteCard";
import { referenceI, textPieceI } from "@/context/constants";
import { splitTextIntoReferences } from "@/utils/text";

const NoteList = ({}) => {
  const { data, textPieces, generateDisplayText } = useContext(DataContext);

  const processedTextPieces: referenceI[] = textPieces
    .filter((v) => v.type === "reference")
    .map((v: textPieceI) => v as referenceI)
    .reduce((acc: referenceI[], curr: referenceI) => {
      if (acc.some((item: referenceI) => item.key === curr.key)) return acc;
      return [...acc, curr];
    }, []);

  return (
    <div className={styles.noteListContainer}>
      {processedTextPieces.map((textPiece: referenceI, i: number) => {
        const showTitle = data[textPiece.key]?.title || "";
        const referenceText = data[textPiece.key]?.text || "" ;
        const showText = generateDisplayText(
          splitTextIntoReferences(referenceText),
          ""
        );
        const shortShowText = generateDisplayText(
          splitTextIntoReferences(
            referenceText.split(" ").slice(0, 25).join(" ") + " ..."
          ),
          ""
        );
        return (
          <NoteCard
            index={i}
            key={textPiece.key}
            itemKey={textPiece.key}
            color={textPiece.color}
            title={showTitle}
            text={showText}
            shortText={shortShowText}
            visible={textPiece.visible}
          />
        );
      })}
    </div>
  );
};

export default NoteList;
