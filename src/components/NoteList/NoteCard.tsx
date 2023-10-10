import { DataContext } from "@/context/data";
import React, { useContext, useState } from "react";

import styles from "./notecard.module.scss";
import { NavigationContext } from "@/context/navigation";
import Button from "../Button/Button";
import { generateDisplayText, splitTextIntoReferences } from "@/utils/text";

interface propsI {
  itemKey: string;
  color: string;
  title: string;
  text: string;
  visible: boolean;
}

const NoteCard = ({ itemKey, color, title, text, visible }: propsI) => {
  const { data, selectedNote, updateSelectedNote, gmMode } =
    useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  const expandable = text.split(/[ \n]/g).length > 30;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpanded((v) => !v);
  };

  const displayText = generateDisplayText(
    splitTextIntoReferences(text),
    true,
    data,
    gmMode
  );
  const displayShortText = generateDisplayText(
    splitTextIntoReferences(text.split(" ").slice(0, 25).join(" ") + " ..."),
    true,
    data,
    gmMode
  );

  return (
    <div
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
      {expandable && (
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
      {(!expandable || isExpanded) && displayText}
      {expandable && !isExpanded && displayShortText}
    </div>
  );
};

export default NoteCard;
