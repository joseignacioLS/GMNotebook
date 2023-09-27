import React, { useContext, useEffect, useState } from "react";
import styles from "./pageedit.module.scss";
import { DataContext } from "@/context/data";
import { getTextReferences } from "@/utils/text";
import Button from "../Button/Button";

const PageEdit = ({}) => {
  const { data, updateData, editMode, selectedNote } = useContext(DataContext);
  const [input, setInput] = useState<{
    title: string;
    text: string;
    display: string;
    showInTree: boolean;
  }>({
    text: data[selectedNote]?.text || "",
    title: data[selectedNote]?.title || "",
    display: data[selectedNote]?.display || "",
    showInTree: data[selectedNote]?.showInTree || false,
  });

  const handleUpdateData = (key: string, value: any) => {
    setInput((oldValue) => {
      return { ...oldValue, [key]: value };
    });
  };

  const generateItemFromInputs = () => {
    return {
      ...data[selectedNote],
      ...input,
    };
  };

  const generateNewEntries = () => {
    return getTextReferences(input.text)
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
    setInput({
      text: data[selectedNote]?.text || "",
      title: data[selectedNote]?.title || "",
      display: data[selectedNote]?.display || "",
      showInTree: data[selectedNote]?.showInTree || false,
    });
  }, [data, selectedNote]);

  return (
    <div className={`${styles.pageEdit} ${!editMode && styles.height0}`}>
      <label>
        <span data-help={"This is the title of the page"}>Title</span>
        <input
          value={input.title}
          onChange={(e) => handleUpdateData("title", e.currentTarget.value)}
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
          value={input.display}
          onChange={(e) => handleUpdateData("display", e.currentTarget.value)}
        ></input>
      </label>
      <label>
        <span data-help={"Decide if this note is shown in the tree"}>
          Shown in Tree?
        </span>
        <input
          type="checkbox"
          checked={input.showInTree}
          onChange={(e) =>
            handleUpdateData("showInTree", e.currentTarget.checked)
          }
        ></input>
      </label>
      <textarea
        value={input.text}
        onChange={(e) => handleUpdateData("text", e.currentTarget.value)}
      ></textarea>
      <Button
        onClick={saveData}
        disabled={
          input.text === data[selectedNote]?.text &&
          input.title === data[selectedNote]?.title &&
          input.display === data[selectedNote]?.display &&
          input.showInTree === data[selectedNote]?.showInTree
        }
      >
        <img src="/images/save.svg" />
      </Button>
    </div>
  );
};

export default PageEdit;
