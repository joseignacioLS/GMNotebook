import { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";

import { DataContext } from "@/context/data";
import { getTextReferences } from "@/utils/text";
import { NavigationContext } from "@/context/navigation";

const Page = ({}) => {
  const {
    data,
    item,
    textPieces,
    updateData,
    editMode,
    setEditMode,
    generateDisplayText,
  } = useContext(DataContext);
  const { path, navBack } = useContext(NavigationContext);
  const [displayText, setDisplayText] = useState<ReactElement[]>([]);
  const [inputText, setInputText] = useState<string>(item.text);
  const [inputTitle, setInputTitle] = useState<string>(item.title);
  const [inputDisplay, setInputDisplay] = useState<string>(item.display);

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
    setEditMode((v: boolean) => !v);
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
    setDisplayText(generateDisplayText(textPieces, styles.reference));
  }, [textPieces, data]);

  useEffect(() => {
    setInputTitle(item.title);
    setInputDisplay(item.display);
    setInputText(
      item.text
        .replace(/\n/g, "")
        .replace(/> *</g, "><")
        .replace(/((?:<br>)+)/g, "\n$1\n")
    );
  }, [item]);

  return (
    <div
      className={`${styles.pageContainer} ${!editMode && styles.editHidden}`}
    >
      <div className={styles.textContainer}>
        <div className={styles.titleContainer}>
          <button
            className="button"
            style={{ opacity: path.length > 1 ? "1" : ".25" }}
            onClick={navBack}
          >
            <img src="/images/back.svg" />
          </button>
          <h1>{item.title}</h1>

          <button className={`button ${styles.btnEdit}`} onClick={toggleHide}>
            <img className="containedImage" src="/images/edit.svg" />
          </button>
        </div>
        <div className={styles.text} id="text">
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

export default Page;
