import React, { useContext, useEffect, useState } from "react";
import styles from "./tutorial.module.scss";
import { DataContext } from "@/context/data";
import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { tipI } from "@/context/constants";
import Button, { behaviourEnum } from "./Button/Button";

const tips: tipI[] = [
  {
    tip: "This is the current page, here you can write about a theme and add anotations which will appear as highlighted words.",
    className: styles.page,
  },
  {
    tip: "This is the title of the page. The left arrow helps you navigate back when you leave a page.",
    className: styles.pageTitle,
  },
  {
    tip: "These are the notes of the page, they appear as the annotations in the text that become visible as you scroll. Use the book icon on the top right of each note to visit them.",
    className: styles.notes,
  },
  {
    tip: "These are action buttons. The show on hover, use them to reset (top) , upload (middle) or download (bottom) the current data. Do not forget to download your notebook every once in a while to not lose progress!",
    className: styles.actions,
  },
  {
    tip: "This is the edit menu. You can open/close it using the toggle button on top of the right column. Here you can modify the title, display words and content of the pages. Click the save icon to update your changes.",
    className: styles.edit,
  },
  {
    tip: "Click on any note to change the note you are modifying. Click on the note title to modify the page.",
    className: styles.edit,
  },
  {
    tip: "Write note:keyword (where keyword can be any alphanumeric term) to create a new note. When you save the note will appear in the right column if the annotation is visible whithin the page.",
    className: styles.keywords1,
  },
  {
    tip: "Now is up to you. Create your own notebook.",
    className: styles.final,
  },
];

const Tutorial = () => {
  const [currentTip, setCurrentTip] = useState<number>(0);
  const { data, setEditMode } = useContext(DataContext);
  const handleNext = () => {
    setCurrentTip((v) => v + 1);
  };
  useEffect(() => {
    if (currentTip === 4) {
      setEditMode(true);
    }
    if (currentTip >= tips.length) {
      setEditMode(false);
      saveToLocalStorage({ check: true }, "tutorial");
    }
  }, [currentTip]);

  useEffect(() => {
    const tutorialCheck = JSON.parse(retrieveLocalStorage("tutorial"));
    if (tutorialCheck?.check || window.innerWidth <= 800 || !data["note"]) {
      setCurrentTip(tips.length);
    }
  }, []);
  return (
    <>
      {currentTip < tips.length && (
        <div className={styles.tutorialContainer}>
          <div className={tips[currentTip].className}>
            <p>{tips[currentTip].tip}</p>
            <Button behaviour={behaviourEnum.POSITIVE} onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Tutorial;
