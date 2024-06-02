import React, { useContext, useEffect, useState } from "react";
import styles from "./pageedit.module.scss";
import { DataContext } from "@/context/data";
import { extractReferences } from "@/utils/text";

const PageEdit = ({}) => {
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

  const getParagraphLength = (text: string): number[] => {
    return text
      .split("\n")
      .map((v: string) => v.length)
      .reduce((acc: number[], curr: number) => {
        if (acc.length === 0) return [curr];
        return [...acc, curr + 1 + acc[acc.length - 1]];
      }, []);
  };

  const getSelectedParagraphIndex = (
    cursorPosition: number,
    text: string
  ): number => {
    const paragraphLength = getParagraphLength(text);
    let pIndex = 0;
    for (let i = 1; i < paragraphLength.length; i++) {
      if (
        paragraphLength[i - 1] < cursorPosition &&
        paragraphLength[i] >= cursorPosition
      ) {
        pIndex = i;
      }
    }
    return pIndex;
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
        onSelect={handleCursorChange}
        onInput={handleCursorChange}
        value={input.text}
        onChange={(e) => handleUpdateData("text", e.currentTarget.value)}
      ></textarea>
    </div>
  );
};

export default PageEdit;
