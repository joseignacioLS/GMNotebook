import React, { ReactElement, useContext } from "react";
import styles from "./reference.module.scss";
import { referenceI } from "@/context/constants";
import { DataContext } from "@/context/data";
import { NavigationContext } from "@/context/navigation";
import { generateColor } from "@/utils/color";

interface propsI {
  reference: referenceI;
  naked?: boolean;
}

const Reference = ({ reference, naked = false }: propsI) => {
  const { selectedNote, updateSelectedNote, data, gmMode } =
    useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  return (
    <span
      className={`${styles.reference} reference${reference.id}`}
      style={{
        backgroundColor: naked ? "rgba(0,0,0,.5)" : generateColor(reference.key),
        outline: selectedNote === reference.key ? "3px solid red" : "0",
      }}
      onMouseOver={() => {
        if (naked) return;
        updateSelectedNote(reference.key || "");
      }}
      onClick={() => {
        if (data[reference.key].showToPlayers || gmMode) {
          updateSelectedNote(reference.key || "");
          navigateTo(reference.key);
        }
      }}
    >
      {data[reference.key]?.display}
    </span>
  );
};

export default Reference;
