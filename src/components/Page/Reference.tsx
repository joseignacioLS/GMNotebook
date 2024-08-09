import React, { useContext, useState } from "react";
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

  const [mouseOverTimeout, setMouseOverTimeout] = useState<any>(undefined);

  const handleMouseOver = (key: string) => {
    setMouseOverTimeout(
      setTimeout(() => {
        highlightNote(key);
      }, 500)
    );
  };

  const handleMouseLeave = () => {
    if (mouseOverTimeout !== undefined) {
      clearTimeout(mouseOverTimeout);
      setMouseOverTimeout(undefined);
    }
  };

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
          updateSelectedNote(reference.key || "");
          navigateTo(reference.key);
        }
      }}
      onMouseOver={() => {
        if (naked) return;
        if (editMode) return;
        handleMouseOver(reference.id || "");
      }}
      onMouseLeave={handleMouseLeave}
    >
      {data[reference.key]?.display}
    </span>
  );
};

export default Reference;
