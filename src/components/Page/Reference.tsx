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
  const { selectedNote, updateSelectedNote } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  return (
    <span
      id={reference.id}
      className={`${styles.reference}`}
      style={{
        backgroundColor: naked ? "transparent" : reference.color,
      }}
      onClick={() => {
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
