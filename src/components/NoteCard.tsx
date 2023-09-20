import { DataContext } from "@/context/data";
import React, { ReactElement, useContext, useState } from "react";

import styles from "./notecard.module.scss";
import { NavigationContext } from "@/context/navigation";

const NoteCard = ({
  index,
  itemKey,
  color,
  title,
  text,
  shortText,
}: {
  index: number;
  itemKey: string;
  color: string;
  title: string;
  text: string | string[] | ReactElement | ReactElement[];
  shortText: string | string[] | ReactElement | ReactElement[];
}) => {
  const { selectedNote, setSelectedNote } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    if (isExpanded) {
      setSelectedNote("");
    }
    setIsExpanded((v) => !v);
  };
  return (
    <div
      key={index}
      id={"note-" + itemKey}
      className={`${styles.note} ${
        itemKey === selectedNote && styles.selected
      }`}
      style={{ backgroundColor: color }}
      onClick={() => {
        if (selectedNote !== itemKey) {
          setSelectedNote("");
        }
      }}
    >
      <span
        className={`button ${styles.linkVisit}`}
        onClick={() => {
          setSelectedNote("");
          navigateTo(itemKey || "");
        }}
      >
        <img src="/images/book.svg" />
      </span>
      <span
        className={`button ${styles.expand}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedNote(itemKey || "");
          toggleExpand();
        }}
      >
        <img src={`/images/${isExpanded ? "minus" : "plus"}.svg`} />
      </span>
      <h2>{title}</h2>
      {isExpanded ? text : shortText}
    </div>
  );
};

export default NoteCard;
