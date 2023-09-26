import React, { ReactElement, useContext } from "react";
import styles from "./reference.module.scss";
import { referenceI } from "@/context/constants";
import { DataContext } from "@/context/data";
import { NavigationContext } from "@/context/navigation";

const Reference = ({
  reference,
  referenceStyle,
  content,
}: {
  reference: referenceI;
  referenceStyle: string;
  content: ReactElement | string;
}) => {
  const { selectedNote, updateSelectedNote } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);
  return (
    <span
      id={reference.id}
      className={`${referenceStyle}`}
      style={{
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
      {content}
    </span>
  );
};

export default Reference;
