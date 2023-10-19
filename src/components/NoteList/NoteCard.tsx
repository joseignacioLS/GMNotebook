import { DataContext } from "@/context/data";
import React, { useContext, useEffect, useState } from "react";

import styles from "./notecard.module.scss";
import { NavigationContext } from "@/context/navigation";
import Button from "../Button/Button";
import { processText } from "@/utils/text";
import { generateColor } from "@/utils/color";

interface propsI {
  itemKey: string;
}

const NoteCard = ({ itemKey }: propsI) => {
  const { data, selectedNote, updateSelectedNote, gmMode } =
    useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpanded((v) => !v);
  };

  const key = itemKey.split("_")[0];

  const title = data[key]?.title || "";
  const text = data[key]?.text || "";
  const expandable = text?.split(/[ \n]/g).length > 30;

  const displayText = processText(text, true, gmMode);

  const displayShortText = processText(
    text.split(" ").slice(0, 25).join(" ") + " ...",
    true,
    gmMode
  );

  if (!gmMode && !data[key]?.showToPlayers) return <></>;

  return (
    <div
      id={`note-${key.split("_")[0]}`}
      className={`${styles.note} ${
        itemKey === selectedNote && styles.selected
      } ${styles.visibleNote}`}
      style={{ backgroundColor: generateColor(key) }}
    >
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
      <h2
        onClick={() => {
          updateSelectedNote(key);
          navigateTo(key || "");
        }}
      >
        {title}
      </h2>
      {(!expandable || isExpanded) && displayText}
      {expandable && !isExpanded && displayShortText}
    </div>
  );
};

export default NoteCard;
