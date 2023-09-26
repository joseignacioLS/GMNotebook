import React, { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./pagedisplay.module.scss";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";
import Button from "../Button/Button";

const PageDisplay = () => {
  const { data, item, textPieces, generateDisplayText, updateSelectedNote } =
    useContext(DataContext);
  const { path, navBack } = useContext(NavigationContext);

  const [displayText, setDisplayText] = useState<ReactElement[]>([]);

  useEffect(() => {
    setDisplayText(generateDisplayText(textPieces, styles.reference));
  }, [textPieces, data]);

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
          <img src="/images/back.svg" />
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
