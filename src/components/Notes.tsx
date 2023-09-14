import { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./Notes.module.scss";

import { DataContext, dataI, textPieceI } from "@/context/data";

const generateDisplayText = (
  text: textPieceI[],
  data: dataI,
  updateSelectedNote: (key: string) => void
) => {
  const chuncks: ReactElement[] = text.map((ele, i) => {
    if (ele.content === "\n") return <br key={i} />;
    if (ele.key === undefined) return <span key={i}>{ele.content}</span>;
    const content = data[ele.key].display;
    return (
      <span
        key={i}
        id={ele.id}
        className={`${styles.reference}`}
        style={{ backgroundColor: ele.color }}
        onClick={() => updateSelectedNote(ele?.key || "")}
      >
        {content}
      </span>
    );
  });
  return chuncks;
};

const Notes = ({
  title,
  text,
  setSelectedNote,
}: {
  title: string;
  text: textPieceI[];
  setSelectedNote: (value: string) => void;
}) => {
  const { data } = useContext(DataContext);
  const [displayText, setDisplayText] = useState<ReactElement[]>([]);
  const updateSelectedNote = (key: string) => {
    setSelectedNote(key);
    setTimeout(
      () => document.querySelector(`#detail-${key}`)?.scrollIntoView(),
      0
    );
  };
  useEffect(() => {
    setDisplayText(generateDisplayText(text, data, updateSelectedNote));
  }, [text]);
  return (
    <div id="notes" className={styles.notesContainer}>
      <h1>{title}</h1>
      <div className={styles.textContainer}>{displayText}</div>
    </div>
  );
};

export default Notes;
