import React, { useContext } from "react";
import styles from "./pagedisplay.module.scss";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";
import Button from "../Button/Button";
import { useProcessText } from "@/hooks/useProcessText";

const PageDisplay: React.FC = () => {
  const { item, updateSelectedNote } = useContext(DataContext);
  const { path, navBack } = useContext(NavigationContext);

  const displayText = useProcessText(item.text, false);

  return (
    <div className={`${styles.pageDisplay}`}>
      <div className={styles.titleContainer}>
        <Button
          naked={true}
          onClick={() => {
            updateSelectedNote(path.at(-2));
            navBack();
          }}
          disabled={path.length < 2}
        >
          <span className={styles["material-symbols-outlined"]}>
            arrow_back_ios
          </span>
        </Button>
        <h1 onClick={() => updateSelectedNote(item.key)}>{item.title}</h1>
      </div>
      <div className={styles.text} id="text">
        {displayText}
      </div>
    </div>
  );
};

export default PageDisplay;
