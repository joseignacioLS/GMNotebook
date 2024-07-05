import { DataContext } from "@/context/data";
import React, { useContext } from "react";

import styles from "./notecard.module.scss";
import { NavigationContext } from "@/context/navigation";
import { generateColor } from "@/utils/color";
import { processText } from "@/utils/text";

interface IProps {
  itemKey: string;
  visible: boolean;
}

const NoteCard: React.FC<IProps> = ({ itemKey, visible }) => {
  const { data, selectedNote, updateSelectedNote } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  const key = itemKey.split("_")[0];

  const title = data[key]?.title || "";
  const text = data[key]?.text || "";

  const displayShortText = processText(
    text.split(" ").length > 25
      ? text.split(" ").slice(0, 25).join(" ") + " ..."
      : text,
    true
  );

  return (
    <div
      id={`note-${key.split("_")[0]}`}
      className={`${styles.note} ${
        itemKey === selectedNote && styles.selected
      } ${visible && styles.visibleNote}`}
      style={{ backgroundColor: generateColor(key) }}
    >
      <div>
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
    </div>
  );
};

export default NoteCard;
