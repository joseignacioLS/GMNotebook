import { DataContext } from "@/context/data";
import React, { ReactElement, useContext } from "react";

import styles from "./DetailCard.module.scss";
import { NavigationContext } from "@/context/navigation";

const DetailCard = ({
  index,
  itemKey,
  color,
  title,
  text,
}: {
  index: number;
  itemKey: string;
  color: string;
  title: string;
  text: string | string[] | ReactElement | ReactElement[];
}) => {
  const { selectedNote, setSelectedNote } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);
  return (
    <div
      key={index}
      id={"detail-" + itemKey}
      className={`${styles.detail} ${
        itemKey === selectedNote && styles.selected
      }`}
      style={{ backgroundColor: color }}
      onMouseOver={() => {
        setSelectedNote(itemKey || "");
      }}
      onMouseOut={() => {
        setSelectedNote("");
      }}
    >
      <span
        className={styles.linkVisit}
        onClick={() => {
          navigateTo(itemKey || "");
        }}
      >
        📕
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
};

export default DetailCard;
