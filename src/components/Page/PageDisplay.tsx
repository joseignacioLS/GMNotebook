import React, { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./pagedisplay.module.scss";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";
import Button from "../Button/Button";

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
        <Button naked={true} onClick={navBack} disabled={path.length < 2}>
          <img src="/images/back.svg" />
        </Button>
        <h1>{item.title}</h1>

        <Button naked={true} onClick={toggleHide}>
          <img className="containedImage" src="/images/edit.svg" />
        </Button>
      </div>
      <div className={styles.text} id="text">
        {displayText}
      </div>
    </div>
  );
};

export default PageDisplay;
