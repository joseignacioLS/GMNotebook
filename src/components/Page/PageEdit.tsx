import React, { useContext, useEffect, useState } from "react";
import styles from "./pageedit.module.scss";
import { DataContext } from "@/context/data";
import { getTextReferences } from "@/utils/text";
import Button from "../Button/Button";

const PageEdit = () => {
  const { data, updateData, editMode, selectedNote } = useContext(DataContext);
  const [inputText, setInputText] = useState<string>(
    data[selectedNote]?.text || ""
  );
  const [inputTitle, setInputTitle] = useState<string>(
    data[selectedNote]?.title || ""
  );
  const [inputDisplay, setInputDisplay] = useState<string>(
    data[selectedNote]?.display || ""
  );
  const [inputTree, setInputTree] = useState<boolean>(
    data[selectedNote]?.showInTree || false
  );

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
      case "tree":
        setInputTree(!!e.currentTarget.checked);
        break;
      default:
        break;
    }
  };

  const generateItemFromInputs = () => {
    return {
      ...data[selectedNote],
      text: inputText,
      title: inputTitle,
      display: inputDisplay,
      showInTree: inputTree,
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
    updateData(
      { ...data, [data[selectedNote].key]: newItem, ...newEntries },
      false
    );
  };

  useEffect(() => {
    setInputTitle(data[selectedNote]?.title || "");
    setInputDisplay(data[selectedNote]?.display || "");
    setInputText(data[selectedNote]?.text || "");
    setInputTree(data[selectedNote]?.showInTree || false);
  }, [data, selectedNote]);

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
      <label>
        <span data-help={"Decide if this note is shown in the tree"}>
          Shown in Tree?
        </span>
        <input
          type="checkbox"
          checked={inputTree}
          value={inputDisplay}
          onChange={(e) => handleUpdateData("tree", e)}
        ></input>
      </label>
      <textarea
        value={inputText}
        onChange={(e) => handleUpdateData("text", e)}
      ></textarea>
      <Button
        onClick={saveData}
        disabled={
          inputText === data[selectedNote]?.text &&
          inputTitle === data[selectedNote]?.title &&
          inputDisplay === data[selectedNote]?.display &&
          inputTree === data[selectedNote]?.showInTree
        }
      >
        <img src="/images/save.svg" />
      </Button>
    </div>
  );
};

export default PageEdit;
