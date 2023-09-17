import React, { useContext } from "react";
import styles from "./Details.module.scss";
import { getWordCount } from "@/utils/text";
import { DataContext } from "@/context/data";
import DetailCard from "./DetailCard";
import { textPieceI } from "@/context/constants";

const Details = ({}) => {
  const {
    data,
    textPieces,
    replaceReferencesByDisplay,
    includeRerencesInText,
    selectedNote,
  } = useContext(DataContext);

  const processedTextPieces = textPieces
    .filter((v) => v.key !== undefined && v.visible)
    .reduce((acc: textPieceI[], curr: textPieceI) => {
      if (acc.some((item: textPieceI) => item.key === curr.key)) return acc;
      return [...acc, curr];
    }, []);

  return (
    <div className={styles.detailContainer}>
      {processedTextPieces.map((textPiece, i) => {
        const showTitle = data[textPiece?.key || ""]?.title;
        const referenceText = includeRerencesInText(
          data[textPiece?.key || ""]?.text || ""
        );
        const showText = replaceReferencesByDisplay(referenceText);
        const shortShowText = replaceReferencesByDisplay(
          referenceText.split(" ").slice(0, 25).join(" ") + "..."
        );
        const textWordCount = getWordCount(referenceText);
        return (
          <DetailCard
            index={i}
            key={textPiece.key}
            itemKey={textPiece.key || ""}
            color={textPiece.color || "#000"}
            title={showTitle}
            text={
              textPiece?.key === selectedNote || textWordCount < 30
                ? showText
                : shortShowText
            }
          />
        );
      })}
    </div>
  );
};

export default Details;
