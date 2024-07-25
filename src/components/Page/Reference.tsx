import React, { useContext } from "react";
import styles from "./reference.module.scss";
import { IReference } from "@/context/constants";
import { DataContext } from "@/context/data";
import { NavigationContext } from "@/context/navigation";
import { colorContext } from "@/context/colors";

interface IProps {
  reference: IReference;
  naked?: boolean;
}

const Reference: React.FC<IProps> = ({ reference, naked = false }) => {
  const { selectedNote, updateSelectedNote, data, editMode, highlightNote } =
    useContext(DataContext);
  const { generateColor } = useContext(colorContext);
  const { navigateTo } = useContext(NavigationContext);
  const [backgroundColor, color] = generateColor(reference.key);

  return (
    <span
      className={`${styles.reference} reference${reference.id} ${
        selectedNote === reference.key && "flash"
      }`}
      style={{
        backgroundColor: naked ? "transparent" : backgroundColor,
        color: naked ? "inherit" : color,
      }}
      onClick={() => {
        if (naked) return;
        if (editMode && selectedNote !== reference.key) {
          updateSelectedNote(reference.key || "");
        } else {
          navigateTo(reference.key);
        }
      }}
      onMouseOver={() => {
        if (naked) return;
        if (editMode) return;
        highlightNote(reference.key || "");
      }}
    >
      {data[reference.key]?.display}
    </span>
  );
};

export default Reference;
