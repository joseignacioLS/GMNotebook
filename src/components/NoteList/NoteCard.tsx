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

const maxNoteContent = 25;
const NoteCard: React.FC<IProps> = ({ itemKey, visible }) => {
  const { data, selectedNote, updateSelectedNote } = useContext(DataContext);
  const { generateColor } = useContext(colorContext);
  const { navigateTo } = useContext(NavigationContext);

  const key = itemKey.split("_")[0];

  const title = data[key]?.title || "";
  const text = data[key]?.text || "";

  const displayShortText = text
    ? processText(
        text.split(" ").length > maxNoteContent * 2
          ? text.split(" ").slice(0, maxNoteContent).join(" ") + "..."
          : text,
        true
      )
    : "";

  const [backgroundColor, color] = generateColor(key);
  return (
    <div
      id={`note-${key.split("_")[0]}`}
      className={`${styles.note} ${
        itemKey === selectedNote && styles.selected
      } ${visible && styles.visibleNote}`}
      style={{ backgroundColor, color }}
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
