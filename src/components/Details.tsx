import React, { useContext } from "react";
import styles from "./details.module.scss";
import { DataContext } from "@/context/data";
import DetailCard from "./DetailCard";
import { textPieceI } from "@/context/constants";
import { splitTextIntoReferences } from "@/utils/text";

const Details = ({}) => {
  const { data, textPieces, replaceReferencesByDisplay, generateDisplayText } =
    useContext(DataContext);

  const processedTextPieces = textPieces
    .filter((v) => v.type === "reference" && v.visible)
    .reduce((acc: textPieceI[], curr: textPieceI) => {
      if (acc.some((item: textPieceI) => item.key === curr.key)) return acc;
      return [...acc, curr];
    }, []);

  return (
    <div className={styles.detailContainer}>
      {processedTextPieces.map((textPiece, i) => {
        const showTitle = data[textPiece?.key || ""]?.title;
        const referenceText = data[textPiece?.key || ""]?.text || "";
        const showText = generateDisplayText(
          splitTextIntoReferences(referenceText),
          ""
        );
        const shortShowText = generateDisplayText(
          splitTextIntoReferences(
            referenceText.split(" ").slice(0, 25).join(" ")+" ..."
          ),
          ""
        );
        //const showText = replaceReferencesByDisplay(referenceText);
        // const shortShowText = replaceReferencesByDisplay(
        //   referenceText.split(" ").slice(0, 25).join(" ") + "..."
        // );
        return (
          <DetailCard
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

export default Details;
