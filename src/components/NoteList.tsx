import React, { useContext } from "react";
import styles from "./notelist.module.scss";
import { DataContext } from "@/context/data";
import NoteCard from "./NoteCard";
import { textPieceI } from "@/context/constants";
import { splitTextIntoReferences } from "@/utils/text";

const NoteList = ({}) => {
  const { data, textPieces, generateDisplayText } = useContext(DataContext);

  const processedTextPieces = textPieces
    .filter((v) => v.type === "reference" && v.visible)
    .reduce((acc: textPieceI[], curr: textPieceI) => {
      if (acc.some((item: textPieceI) => item.key === curr.key)) return acc;
      return [...acc, curr];
    }, []);

  return (
    <div className={styles.noteListContainer}>
      {processedTextPieces.map((textPiece, i) => {
        const showTitle = data[textPiece?.key || ""]?.title;
        const referenceText = data[textPiece?.key || ""]?.text || "";
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
            itemKey={textPiece.key || ""}
            color={textPiece.color || "#000"}
            title={showTitle}
            text={showText}
            shortText={shortShowText}
          />
        );
      })}
    </div>
  );
};

export default NoteList;
