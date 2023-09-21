import React, { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./pagedisplay.module.scss";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";

const PageDisplay = () => {
  const { data, item, textPieces, editMode, setEditMode, generateDisplayText } =
    useContext(DataContext);
  const { path, navBack } = useContext(NavigationContext);

  const [displayText, setDisplayText] = useState<ReactElement[]>([]);

  const toggleHide = () => {
    setEditMode((v: boolean) => !v);
  };

  useEffect(() => {
    setDisplayText(generateDisplayText(textPieces, styles.reference));
  }, [textPieces, data]);
  return (
    <div className={`${styles.pageDisplay} ${!editMode && styles.height100}`}>
      <div className={styles.titleContainer}>
        <button
          className="button"
          style={{ opacity: path.length > 1 ? "1" : ".25" }}
          onClick={navBack}
        >
          <img src="/images/back.svg" />
        </button>
        <h1>{item.title}</h1>

        <button className={`button ${styles.btnEdit}`} onClick={toggleHide}>
          <img className="containedImage" src="/images/edit.svg" />
        </button>
      </div>
      <div className={styles.text} id="text">
        {displayText}
      </div>
    </div>
  );
};

export default PageDisplay;
