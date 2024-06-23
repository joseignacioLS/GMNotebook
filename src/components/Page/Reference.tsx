import React, { useContext } from "react";
import styles from "./reference.module.scss";
import { IReference } from "@/context/constants";
import { DataContext } from "@/context/data";
import { NavigationContext } from "@/context/navigation";
import { generateColor } from "@/utils/color";

interface IProps {
  reference: IReference;
  naked?: boolean;
}

const Reference = ({ reference, naked = false }: IProps) => {
  const { selectedNote, updateSelectedNote, data } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  return (
    <span
      className={`${styles.reference} reference${reference.id}`}
      style={{
        backgroundColor: naked ? "transparent" : generateColor(reference.key),
        outline: selectedNote === reference.key ? "3px solid red" : "0",
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
