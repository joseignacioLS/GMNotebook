import { DataContext } from "@/context/data";
import React, { useContext } from "react";

import styles from "./notecard.module.scss";
import { NavigationContext } from "@/context/navigation";
import { processText } from "@/utils/text";
import { colorContext } from "@/context/colors";

interface IProps {
  itemKey: string;
  visible: boolean;
}

const NoteCard: React.FC<IProps> = ({ itemKey, visible }) => {
  const { data, selectedNote, updateSelectedNote } = useContext(DataContext);
  const { generateColor } = useContext(colorContext);
  const { navigateTo } = useContext(NavigationContext);

  const key = itemKey.split("_")[0];

  const title = data[key]?.title || "";
  const text = data[key]?.text || "";

  const displayShortText = processText(
    text.split("\n").length > 5
      ? text.split("\n").slice(0, 5).join("\n") + "\n..."
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
