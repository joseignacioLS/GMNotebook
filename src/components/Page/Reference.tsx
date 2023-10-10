import React, { ReactElement, useContext } from "react";
import styles from "./reference.module.scss";
import { referenceI } from "@/context/constants";
import { DataContext } from "@/context/data";
import { NavigationContext } from "@/context/navigation";

interface propsI {
  reference: referenceI;
  children: ReactElement | string;
  naked?: boolean;
}

const Reference = ({ reference, children, naked = false }: propsI) => {
  const { data, selectedNote, updateSelectedNote, gmMode } =
    useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  const unaccesible = !gmMode && !data[reference.key]?.showToPlayers;

  return (
    <span
      id={reference.id}
      className={`${styles.reference}`}
      style={{
        backgroundColor: naked || unaccesible ? "transparent" : reference.color,
        outline: selectedNote === reference.key ? "3px solid red" : "0",
        cursor: unaccesible ? "default" : "pointer",
        userSelect: unaccesible ? "auto" : "none",
      }}
      onClick={() => {
        if (unaccesible) return;
        if (selectedNote === reference.key) {
          navigateTo(reference.key);
        } else {
          updateSelectedNote(reference.key || "");
        }
      }}
    >
      {children}
    </span>
  );
};

export default Reference;
