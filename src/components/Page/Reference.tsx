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
  const { selectedNote, updateSelectedNote, data } = useContext(DataContext);
  const { generateColor } = useContext(colorContext);
  const { navigateTo } = useContext(NavigationContext);

  return (
    <span
      className={`${styles.reference} reference${reference.id} ${
        selectedNote === reference.key && "flash"
      }`}
      style={{
        backgroundColor: naked ? "transparent" : generateColor(reference.key),
      }}
      onClick={() => {
        if (naked) return;
        if (selectedNote === reference.key) {
          navigateTo(reference.key);
        } else {
          updateSelectedNote(reference.key || "");
        }
      }}
    >
      {data[reference.key]?.display}
    </span>
  );
};

export default Reference;
