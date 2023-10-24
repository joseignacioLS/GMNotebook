import React, { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./pagedisplay.module.scss";
import { DataContext } from "@/context/data";
import { processText } from "@/utils/text";
import Button from "../Button/Button";
import { useRouter } from "next/router";

const PageDisplay = () => {
  const { item, updateSelectedNote, gmMode, gameName, currentPage } =
    useContext(DataContext);
  const router = useRouter();

  const [displayText, setDisplayText] = useState<ReactElement[]>([]);
  useEffect(() => {
    const newDisplay = processText(item.text, false, gmMode);
    setDisplayText(newDisplay);
  }, [item.text, gmMode]);

  return (
    <div className={`${styles.pageDisplay}`}>
      <div className={styles.titleContainer}>
        <Button
          onClick={() => {
            router.push(`/${gameName}/RootPage`);
          }}
          naked={true}
          disabled={currentPage === "RootPage"}
        >
          <img src="/images/house.svg" />
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
