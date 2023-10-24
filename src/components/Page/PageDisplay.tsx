import React, { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./pagedisplay.module.scss";
import { DataContext } from "@/context/data";
import { processText } from "@/utils/text";

const PageDisplay = () => {
  const { item, updateSelectedNote, gmMode, currentPage } =
    useContext(DataContext);

  const [displayText, setDisplayText] = useState<ReactElement[]>([]);
  useEffect(() => {
    const newDisplay = processText(item.text, false, gmMode);
    setDisplayText(newDisplay);
  }, [item.text, gmMode]);

  return (
    <div className={`${styles.pageDisplay}`}>
      <div className={styles.titleContainer}>
        <h1 onClick={() => updateSelectedNote(item.key)}>{item.title}</h1>
      </div>
      <div className={styles.text} id="text">
        {displayText}
      </div>
    </div>
  );
};

export default PageDisplay;
