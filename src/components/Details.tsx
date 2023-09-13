import React, { useContext } from "react";
import styles from "./Detail.module.scss";
import { referenceI } from "@/api/data";
import {
  getWordCount,
  includeRerencesInText,
  replaceReferencesByDisplay,
} from "@/utils/text";
import { DataContext } from "@/context/data";
import Link from "next/link";

const Details = ({
  references = [],
  selectedNote,
  setSelectedNote,
}: {
  references: referenceI[];
  selectedNote: string | undefined;
  setSelectedNote: (value: string) => void;
}) => {
  const { data, updateItem } = useContext(DataContext);
  return (
    <div className={styles.detailContainer}>
      {references
        ?.reduce((acc: referenceI[], curr: referenceI) => {
          if (
            acc.find(
              (item: referenceI) => item.visible && item.key === curr.key
            )
          )
            return acc;
          return [...acc, curr];
        }, [])
        .map((item: referenceI) => {
          const text = includeRerencesInText(item?.data.text, data);
          const textWordCount = getWordCount(item?.data.text);
          const isNavegable = text !== item?.data.text;
          return (
            <div
              key={item?.id}
              id={"detail-" + item.id}
              className={`${styles.detail} ${!item?.visible && styles.hidden} ${
                item.key === selectedNote && styles.selected
              }`}
              style={{ backgroundColor: item?.color }}
              onMouseOver={() => {
                setSelectedNote(item.data.key);
              }}
              onMouseOut={() => {
                setSelectedNote("");
              }}
            >
              {isNavegable && (
                <span
                  className={styles.linkVisit}
                  onClick={() => {
                    updateItem(item?.data.key);
                  }}
                >
                  📕
                </span>
              )}
              <h2>{item?.data.title}</h2>
              <p>
                {item?.data.key === selectedNote || textWordCount < 30
                  ? item?.data.text
                  : item?.data.text.split(" ").slice(0, 25).join(" ") + "..."}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default Details;
