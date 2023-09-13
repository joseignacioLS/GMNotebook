import { itemI } from "@/api/data";
import React from "react";

import styles from "./EntryInput.module.scss";

const EntryInput = ({
  entry,
  updateEntry,
}: {
  entry: itemI;
  updateEntry: (key: string, entry: itemI) => void;
}) => {
  const handleChange = (key: string, value: string) => {
    updateEntry(entry.key, { ...entry, [key]: value });
  };

  return (
    <div className={styles.inputAreaContainer}>
      <label className={styles.inputArea}>
        Title:
        <input
          type="text"
          value={entry["title"]}
          onChange={(e) => handleChange("title", e.currentTarget.value)}
        ></input>
      </label>
      <label className={styles.inputArea}>
        Key:
        <input
          type="text"
          value={entry["key"]}
          onChange={(e) => handleChange("key", e.currentTarget.value)}
        ></input>
      </label>
      <label className={styles.inputArea}>
        Display:
        <input
          type="text"
          value={entry["display"]}
          onChange={(e) => handleChange("display", e.currentTarget.value)}
        ></input>
      </label>
      <label className={styles.inputArea}>
        baseEntry:
        <input
          type="text"
          value={entry["baseEntry"]}
          onChange={(e) => handleChange("baseEntry", e.currentTarget.value)}
        ></input>
      </label>
      <label className={styles.inputArea}>
        Text:
        <input
          type="text"
          value={entry["text"]}
          onChange={(e) => handleChange("text", e.currentTarget.value)}
        ></input>
      </label>
    </div>
  );
};

export default EntryInput;
