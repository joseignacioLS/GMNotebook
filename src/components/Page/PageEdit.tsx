import React, { useContext, useEffect, useState } from "react";
import styles from "./pageedit.module.scss";
import { DataContext } from "@/context/data";
import { getTextReferences } from "@/utils/text";
import Button from "../Button/Button";

const PageEdit = () => {
  const { data, item, updateData, editMode } = useContext(DataContext);
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
    setInputTitle(item.title);
    setInputDisplay(item.display);
    setInputText(item.text);
  }, [item]);
  return (
    <div className={`${styles.pageEdit} ${!editMode && styles.height0}`}>
      <label>
        <span data-help={"This is the title of the page"}>Title</span>
        <input
          value={inputTitle}
          onChange={(e) => handleUpdateData("title", e)}
        ></input>
      </label>
      <label>
        <span
          data-help={
            "This will substitute the note:keyword wherever this page is referenced as a note."
          }
        >
          Display
        </span>
        <input
          value={inputDisplay}
          onChange={(e) => handleUpdateData("display", e)}
        ></input>
      </label>
      <textarea
        value={inputText}
        onChange={(e) => handleUpdateData("text", e)}
      ></textarea>
      <Button
        onClick={saveData}
        disabled={
          inputText === item.text &&
          inputTitle === item.title &&
          inputDisplay === item.display
        }
      >
        <img src="/images/save.svg" />
      </Button>
    </div>
  );
};

export default PageEdit;
