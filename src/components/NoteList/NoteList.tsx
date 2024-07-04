import React, { useContext, useEffect, useState } from "react";
import styles from "./notelist.module.scss";
import { DataContext } from "@/context/data";
import NoteCard from "./NoteCard";
import { filterReferencesBasedOnVisibility } from "@/utils/text";

const NoteList: React.FC = () => {
  const { item } = useContext(DataContext);
  const [references, setReferences] = useState<string[]>([]);

  const updateReferences = () => {
    setReferences(filterReferencesBasedOnVisibility(item.text));
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
