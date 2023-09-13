import { ReactElement, useEffect, useState } from "react";
import styles from "./Notes.module.scss";

import { referenceI } from "@/api/data";

const generateDisplayText = (
  text: string,
  references: referenceI[],
  updateSelectedNote: (value: string, id: string) => void
) => {
  let lastIndex = 0;
  const chuncks: ReactElement[] = [];
  references.forEach((ref: referenceI, i: number) => {
    chuncks.push(<span key={i}>{text.slice(lastIndex, ref.index)}</span>);
    lastIndex = ref.index + ref.key.length + 2;
    chuncks.push(
      <span
        key={ref.id}
        id={ref.id}
        className={styles.reference}
        style={{ backgroundColor: ref.color }}
        onClick={() => updateSelectedNote(ref.key, ref.id)}
      >
        {ref.data.display}
      </span>
    );
  });
  chuncks.push(<span key="last">{text.slice(lastIndex)}</span>);
  return chuncks;
};

const Notes = ({
  title,
  text,
  references,
  setSelectedNote,
}: {
  title: string;
  text: string;
  references: referenceI[];
  setSelectedNote: (value: string) => void;
}) => {
  const [displayText, setDisplayText] = useState<ReactElement[]>([]);
  const updateSelectedNote = (key: string, id: string) => {
    setSelectedNote(key);
    setTimeout(
      () => document.querySelector(`#detail-${id}`)?.scrollIntoView(),
      0
    );
  };
  useEffect(() => {
    setDisplayText(
      generateDisplayText(text, references, updateSelectedNote)
    );
  }, [text, references]);
  return (
    <div id="notes" className={styles.notesContainer}>
      <h1>{title}</h1>
      <div className={styles.textContainer}>{displayText}</div>
    </div>
  );
};

export default Notes;
