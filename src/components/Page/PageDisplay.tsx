import React, { useContext } from "react";
import styles from "./pagedisplay.module.scss";
import { NavigationContext } from "@/context/navigation";
import { DataContext } from "@/context/data";
import Button from "../Button/Button";
import { processText } from "@/utils/text";
import { colorContext } from "@/context/colors";

const PageDisplay: React.FC = () => {
  const { item, updateSelectedNote } = useContext(DataContext);
  const { path, navBack } = useContext(NavigationContext);
  const { generateColor } = useContext(colorContext);

  const displayText = processText(item.text, false);

  const [backgroundColor, color] = generateColor(item.key);
  return (
    <div className={`${styles.pageDisplay}`}>
      <div className={styles.titleContainer} style={{ backgroundColor }}>
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
        <h1 onClick={() => updateSelectedNote(item.key)} style={{ color }}>
          {item.title}
        </h1>
      </div>
      <div className={styles.text} id="text">
        {displayText}
      </div>
    </div>
  );
};

export default PageDisplay;
