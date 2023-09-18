import { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./Notes.module.scss";

import { DataContext } from "@/context/data";
import { getTextReferences } from "@/utils/text";
import { dataI, textPieceI } from "@/context/constants";
import { NavigationContext } from "@/context/navigation";

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

const Notes = ({}) => {
  const { data, item, textPieces, updateData } = useContext(DataContext);
  const { path, navBack } = useContext(NavigationContext);
  const [displayText, setDisplayText] = useState<ReactElement[]>([]);
  const [editHidden, setEditHidden] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>(item.text);
  const [inputTitle, setInputTitle] = useState<string>(item.title);
  const [inputDisplay, setInputDisplay] = useState<string>(item.display);

  const updateSelectedNote = (key: string) => {
    setTimeout(() => {
      document.querySelector(`#detail-${key}`)?.scrollIntoView();
      // add animation to card
      document.querySelector(`#detail-${key}`)?.classList.add("flash");
      setTimeout(() => {
        document.querySelector(`#detail-${key}`)?.classList.remove("flash");
      }, 600);
    }, 0);
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

  const generateItemFromInputs = () => {
    return {
      ...item,
      text: inputText,
      title: inputTitle,
      display: inputDisplay,
    };
  };

  const generateNewEntries = () => {
    return getTextReferences(inputText)
      .filter((v) => {
        return !data[v];
      })
      .reduce((acc, key) => {
        return {
          ...acc,
          [key]: {
            title: key,
            text: "Description",
            display: key,
            key,
          },
        };
      }, {});
  };

  const saveData = () => {
    const newItem = generateItemFromInputs();
    const newEntries = generateNewEntries();
    updateData({ ...data, [item.key]: newItem, ...newEntries }, false);
  };

  useEffect(() => {
    setDisplayText(generateDisplayText(textPieces, data, updateSelectedNote));
  }, [textPieces, data]);

  useEffect(() => {
    setInputTitle(item.title);
    setInputDisplay(item.display);
    setInputText(item.text);
  }, [item]);

  return (
    <div
      className={`${styles.notesContainer} ${editHidden && styles.editHidden}`}
    >
      <button className={`button ${styles.btnHide}`} onClick={toggleHide}>
        <img className="containedImage" src="/images/edit.svg" />
      </button>
      <div className={styles.textContainer}>
        <div className={styles.titleContainer}>
          <span
            className="button"
            style={{ opacity: path.length < 2 ? ".25" : "1" }}
            onClick={navBack}
          >
            <img src="/images/back.svg" />
          </span>
          <h1>{item.title}</h1>
        </div>
        <div className={styles.notes} id="notes">
          {displayText}
        </div>
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
          className="button"
          onClick={saveData}
          disabled={
            inputText === item.text &&
            inputTitle === item.title &&
            inputDisplay === item.display
          }
        >
          <img src="/images/save.svg" />
        </button>
      </div>
    </div>
  );
};

export default Notes;
