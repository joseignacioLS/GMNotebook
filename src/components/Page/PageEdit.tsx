import React, { useContext, useEffect, useState } from "react";
import styles from "./pageedit.module.scss";
import { DataContext } from "@/context/data";
import { extractReferences, getSelectedParagraphIndex } from "@/utils/text";
import Input from "../Input/Input";

const PageEdit: React.FC = () => {
  const { item, data, updateData, editMode, selectedNote } =
    useContext(DataContext);
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
    return extractReferences(input.text)
      .map((v) => {
        return v.split("_")[0];
      })
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
    if (!data[selectedNote]) return;
    updateData(
      { ...data, [data[selectedNote].key]: newItem, ...newEntries },
      false
    );
  };

  useEffect(() => {
    saveData();
  }, [input.text, input.display, input.title, input.showInTree]);

  const handleCursorChange = (e: any) => {
    const cursorPosition = e.currentTarget?.selectionStart;
    const text = e.currentTarget.value;

    const pIndex = getSelectedParagraphIndex(cursorPosition, text);
    removeSelectedParagraph(pIndex);
  };

  const removeSelectedParagraph = (selectedIndex: number = -1) => {
    const allParagraphs = Array.from(document.querySelectorAll("#text > p"));
    let index = 0;
    for (let p of allParagraphs) {
      p?.classList.remove("edit-p");
      if (
        editMode &&
        index === selectedIndex &&
        p.innerHTML !== "" &&
        item.title === input.title
      ) {
        p?.scrollIntoView();
        p?.classList.add("edit-p");
      }
      index += 1;
    }
  };

  useEffect(() => {
    setInput({
      text: data[selectedNote]?.text || "",
      title: data[selectedNote]?.title || "",
      display: data[selectedNote]?.display || "",
      showInTree: data[selectedNote]?.showInTree || false,
    });
  }, [data, selectedNote]);

  useEffect(() => {
    return removeSelectedParagraph;
  }, []);
  return (
    <div className={`${styles.pageEdit} ${!editMode && styles.height0}`}>
      <Input
        value={input.title}
        onClick={(e) => handleUpdateData("title", e.currentTarget.value)}
        label={"Title"}
        tooltip={"This is the title of the page"}
      />
      <Input
        value={input.display}
        onClick={(e) => handleUpdateData("display", e.currentTarget.value)}
        label={"Display"}
        tooltip={
          "This will substitute the note:keyword wherever this page is referenced as a note."
        }
      />
      <Input
        value={input.showInTree}
        onClick={(e) => handleUpdateData("showInTree", e.currentTarget.checked)}
        label={" Show in Tree?"}
        tooltip={"Decide if this note is shown in the tree"}
        type="checkbox"
      />
      <textarea
        onSelect={handleCursorChange}
        onInput={handleCursorChange}
        value={input.text}
        onChange={(e) => handleUpdateData("text", e.currentTarget.value)}
      ></textarea>
    </div>
  );
};

export default PageEdit;
