import React, { ReactElement, useContext } from "react";
import styles from "./reference.module.scss";
import { referenceI } from "@/context/constants";
import { DataContext } from "@/context/data";
import { NavigationContext } from "@/context/navigation";

interface propsI {
  reference: referenceI;
  referenceStyle: string;
  children: ReactElement | string;
}

const Reference = ({ reference, referenceStyle, children }: propsI) => {
  const { selectedNote, updateSelectedNote } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  return (
    <span
      id={reference.id}
      className={`${referenceStyle}`}
      style={{
        userSelect: "none",
        backgroundColor:
          referenceStyle !== "" ? reference.color : "transparent",
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
