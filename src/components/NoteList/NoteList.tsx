import React, { useContext, useEffect, useState } from "react";
import styles from "./notelist.module.scss";
import { DataContext } from "@/context/data";
import NoteCard from "./NoteCard";
import { extractReferences } from "@/utils/text";

const NoteList = ({}) => {
  const { item } = useContext(DataContext);
  const [references, setReferences] = useState<string[]>([]);

  const checkIfVisible = (itemKey: string) => {
    const items = Array.from(
      document.querySelectorAll(`#text .reference${itemKey}`)
    );
    return items.some((item) => {
      const boundingRect = item.getBoundingClientRect();
      if (!boundingRect) return false;
      const notesContainer = document.querySelector("#text") as any;
      const titleSpace = 80;
      return (
        boundingRect.top >= titleSpace &&
        boundingRect.top <= (notesContainer?.offsetHeight || 0) + titleSpace
      );
    });
  };

  const updateReferences = () => {
    const extractedReferences = extractReferences(item.text);
    const filteredReferences = extractedReferences.reduce(
      (acc: string[], key: string) => {
        const visible = checkIfVisible(key);
        if (!visible) return acc;
        const searchKey = key.split("_")[0];
        const alreadyThere = acc.some((reference: string) => {
          return searchKey === reference.split("_")[0];
        });
        if (alreadyThere) return acc;
        return [...acc, key] as string[];
      },
      [] as string[]
    );
    setReferences(filteredReferences);
  };

  useEffect(() => {
    setTimeout(updateReferences, 100);
    document
      .querySelector("#text")
      ?.addEventListener("scroll", updateReferences);
    return () => {
      document
        .querySelector("#text")
        ?.removeEventListener("scroll", updateReferences);
    };
  }, [item.text]);

  return (
    <div className={styles.noteListContainer} id="notes">
      {references.map((reference: string) => {
        return <NoteCard key={reference} itemKey={reference} />;
      })}
    </div>
  );
};

export default NoteList;
