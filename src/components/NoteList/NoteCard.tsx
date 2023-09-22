import { DataContext } from "@/context/data";
import React, { ReactElement, useContext, useState } from "react";

import styles from "./notecard.module.scss";
import { NavigationContext } from "@/context/navigation";
import Button from "../Button/Button";

const NoteCard = ({
  index,
  itemKey,
  color,
  title,
  text,
  shortText,
  visible,
}: {
  index: number;
  itemKey: string;
  color: string;
  title: string;
  text: string | string[] | ReactElement | ReactElement[];
  shortText: string | string[] | ReactElement | ReactElement[];
  visible: boolean;
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
      } ${visible && styles.visibleNote}`}
      style={{ backgroundColor: color }}
      onClick={() => {
        if (selectedNote !== itemKey) {
          setSelectedNote("");
        }
      }}
    >
      <Button
        addClass={styles.linkVisit}
        naked={true}
        onClick={() => {
          setSelectedNote("");
          navigateTo(itemKey || "");
        }}
      >
        <img src="/images/book.svg" />
      </Button>
      <Button
        addClass={styles.expand}
        naked={true}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedNote(itemKey || "");
          toggleExpand();
        }}
      >
        <img src={`/images/${isExpanded ? "minus" : "plus"}.svg`} />
      </Button>
      <h2>{title}</h2>
      {isExpanded ? text : shortText}
    </div>
  );
};

export default NoteCard;
