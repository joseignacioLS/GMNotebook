import React, { useContext } from "react";
import styles from "./Detail.module.scss";
import {
  getWordCount,
  includeRerencesInText,
  replaceReferencesByDisplay,
} from "@/utils/text";
import { DataContext, textPieceI } from "@/context/data";

const Details = ({
  selectedNote,
  setSelectedNote,
}: {
  selectedNote: string | undefined;
  setSelectedNote: (value: string) => void;
}) => {
  const { item, data, updateItem, textPieces } = useContext(DataContext);
  return (
    <div className={styles.detailContainer}>
      {textPieces
        .filter((v) => v.key !== undefined && v.visible)
        .reduce((acc: textPieceI[], curr: textPieceI) => {
          if (acc.some((item: textPieceI) => item.key === curr.key)) return acc;
          return [...acc, curr];
        }, [])
        .map((textPiece, i) => {
          const text = includeRerencesInText(item.text, data);

          const showTitle = data[textPiece?.key || ""].title;
          const showText = replaceReferencesByDisplay(
            includeRerencesInText(data[textPiece?.key || ""].text, data),
            data
          );
          const textWordCount = getWordCount(showText);
          const isNavegable = text !== showText;
          return (
            <div
              key={i}
              id={"detail-" + textPiece.key}
              className={`${styles.detail} ${
                textPiece.key === selectedNote && styles.selected
              }`}
              style={{ backgroundColor: textPiece?.color }}
              onMouseOver={() => {
                setSelectedNote(textPiece?.key || "");
              }}
              onMouseOut={() => {
                setSelectedNote("");
              }}
            >
              {isNavegable && (
                <span
                  className={styles.linkVisit}
                  onClick={() => {
                    updateItem(textPiece?.key || "");
                  }}
                >
                  📕
                </span>
              )}
              <h2>{showTitle}</h2>
              <p>
                {textPiece?.key === selectedNote || textWordCount < 30
                  ? showText
                  : showText.split(" ").slice(0, 25).join(" ") + "..."}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default Details;
