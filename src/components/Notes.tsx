import { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./Notes.module.scss";

import { DataContext, dataI, textPieceI } from "@/context/data";
import { getTextReferences } from "@/utils/text";

const generateDisplayText = (
  text: textPieceI[],
  data: dataI,
  updateSelectedNote: (key: string) => void
) => {
  const chuncks: ReactElement[] = text.map((ele, i) => {
    if (ele.content === "<br>") return <br key={i} />;
    if (ele.key === undefined) return <span key={i}>{ele.content}</span>;
    const content = data[ele.key]?.display || "";
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
  const { data, item, updateData } = useContext(DataContext);
  const [displayText, setDisplayText] = useState<ReactElement[]>([]);
  const [editHidden, setEditHidden] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>(item.text);
  const [inputTitle, setInputTitle] = useState<string>(item.title);
  const [inputDisplay, setInputDisplay] = useState<string>(item.display);
  const updateSelectedNote = (key: string) => {
    setSelectedNote(key);
    setTimeout(
      () => document.querySelector(`#detail-${key}`)?.scrollIntoView(),
      0
    );
  };
  const handleUpdateData = (key: string, e: any) => {
    switch (key) {
      case "text":
        setInputText(e.currentTarget.value);
        break;
      case "title":
        setInputTitle(e.currentTarget.value);
        break;
      case "display":
        setInputDisplay(e.currentTarget.value);
        break;
      default:
        break;
    }
  };

  const toggleHide = () => {
    setEditHidden((v) => !v);
  };

  const saveData = () => {
    const newItem = {
      ...item,
      text: inputText,
      title: inputTitle,
      display: inputDisplay,
    };
    // catch new entries
    const newEntries = getTextReferences(inputText)
      .map((v) => v.replace(/[\[|\]]/g, ""))
      .filter((v) => {
        return !data[v];
      })
      .reduce((acc, key) => {
        return {
          ...acc,
          [key]: {
            title: key,
            text: "",
            display: key,
            key,
          },
        };
      }, {});
    updateData({ ...data, [item.key]: newItem, ...newEntries }, false);
  };

  useEffect(() => {
    setDisplayText(generateDisplayText(text, data, updateSelectedNote));
  }, [text]);

  useEffect(() => {
    setInputTitle(item.title);
    setInputDisplay(item.display);
    setInputText(item.text);
  }, [item]);
  return (
    <div
      className={`${styles.notesContainer} ${editHidden && styles.editHidden}`}
    >
      <button className={styles.btnHide} onClick={toggleHide}>
        ✏️
      </button>
      <div className={styles.textContainer}>
        <h1>{title}</h1>
        <div id="notes">{displayText}</div>
      </div>
      <div className={`${styles.textEdit}`}>
        <label>
          <span>Title</span>
          <input
            value={inputTitle}
            onChange={(e) => handleUpdateData("title", e)}
          ></input>
        </label>
        <label>
          <span>Display</span>
          <input
            value={inputDisplay}
            onChange={(e) => handleUpdateData("display", e)}
          ></input>
        </label>
        <textarea
          value={inputText}
          onChange={(e) => handleUpdateData("text", e)}
        ></textarea>
        <button
          onClick={saveData}
          disabled={
            inputText === item.text &&
            inputTitle === item.title &&
            inputDisplay === item.display
          }
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Notes;
