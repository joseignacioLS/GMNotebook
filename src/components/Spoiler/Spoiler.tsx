import { useContext, useState } from "react";
import { DataContext } from "@/context/data";

import styles from "./spoiler.module.scss";

interface IProps {
  id: string;
  text: string;
  wrapped: boolean;
}
const Spoiler = ({ text, id, wrapped }: IProps) => {
  const { canEdit, editMode } = useContext(DataContext);

  return (
    <span
      id={id}
      className={`${styles.spoiler} text ${!wrapped && "paragraph"}`}
    >
      {text}
      <div
        className={`${styles.cover} ${editMode && styles.preview} ${
          !canEdit && styles.notUncovereable
        }`}
      >
        <span className={styles["material-symbols-outlined"]}>
          visibility_off
        </span>
      </div>
    </span>
  );
};

export default Spoiler;
