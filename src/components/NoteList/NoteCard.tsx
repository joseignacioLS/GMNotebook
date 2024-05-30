import { DataContext } from "@/context/data";
import React, { useContext } from "react";

import styles from "./notecard.module.scss";
import { NavigationContext } from "@/context/navigation";
import { processText } from "@/utils/text";
import { generateColor } from "@/utils/color";

interface propsI {
  itemKey: string;
}

const NoteCard = ({ itemKey }: propsI) => {
  const { data, selectedNote, updateSelectedNote, editMode } =
    useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  const key = itemKey.split("_")[0];

  const title = data[key]?.title || "";
  const text = data[key]?.text || "";

  const displayShortText = processText(
    text.split(" ").length > 25
      ? text.split(" ").slice(0, 25).join(" ") + " ..."
      : text,
    true,
    editMode
  );

  return (
    <div
      id={`note-${key.split("_")[0]}`}
      className={`${styles.note} ${
        itemKey === selectedNote && styles.selected
      } ${styles.visibleNote}`}
      style={{ backgroundColor: generateColor(key) }}
    >
      <h2
        onClick={() => {
          updateSelectedNote(key);
          navigateTo(key || "");
        }}
      >
        {title}
      </h2>
      {displayShortText}
    </div>
  );
};

export default NoteCard;
