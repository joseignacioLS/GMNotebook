import { DataContext } from "@/context/data";
import React, { ReactElement, useContext, useState } from "react";

import styles from "./notecard.module.scss";
import { NavigationContext } from "@/context/navigation";
import Button from "../Button/Button";

interface propsI {
  index: number;
  itemKey: string;
  color: string;
  title: string;
  text: string | string[] | ReactElement | ReactElement[];
  shortText: string | string[] | ReactElement | ReactElement[] | undefined;
  visible: boolean;
}

const NoteCard = ({
  index,
  itemKey,
  color,
  title,
  text,
  shortText,
  visible,
}: propsI) => {
  const { selectedNote, updateSelectedNote } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
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
    >
      <Button
        addClass={styles.linkVisit}
        naked={true}
        onClick={() => {
          updateSelectedNote(itemKey);
          navigateTo(itemKey || "");
        }}
      >
        <img src="/images/book.svg" />
      </Button>
      {shortText !== undefined && (
        <Button
          addClass={styles.expand}
          naked={true}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          <img src={`/images/${isExpanded ? "minus" : "plus"}.svg`} />
        </Button>
      )}
      <h2>{title}</h2>
      {isExpanded || shortText === undefined ? text : shortText}
    </div>
  );
};

export default NoteCard;
