import React, { useContext, useEffect, useState } from "react";
import styles from "./pageedit.module.scss";
import { DataContext } from "@/context/data";
import { extractReferences } from "@/utils/text";
import { useUpdate } from "@/hooks/customHooks";

const PageEdit = ({}) => {
  const { item, data, updateData, editMode, selectedNote } =
    useContext(DataContext);
  const [input, setInput] = useState<{
    title: string;
    text: string;
    display: string;
    showInTree: boolean;
    showToPlayers: boolean;
  }>({
    text: data[selectedNote]?.text || "",
    title: data[selectedNote]?.title || "",
    display: data[selectedNote]?.display || "",
    showInTree: data[selectedNote]?.showInTree || false,
    showToPlayers: data[selectedNote]?.showToPlayers || false,
  });

  const handleInput = (key: string, value: any) => {
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

  useUpdate(saveData, [
    input.text,
    input.display,
    input.title,
    input.showInTree,
    input.showToPlayers,
  ]);

  const handleCursorChange = (e: any) => {
    const cursorPosition = e.currentTarget?.selectionStart;
    const text = e.currentTarget.value;
    const paragraphLength = text
      .split("\n")
      .map((v: string) => v.length)
      .reduce((acc: number[], curr: number) => {
        if (acc.length === 0) return [curr];
        return [...acc, curr + 1 + acc[acc.length - 1]];
      }, []);
    let pIndex = 0;

    for (let i = 1; i < paragraphLength.length; i++) {
      if (
        paragraphLength[i - 1] < cursorPosition &&
        paragraphLength[i] >= cursorPosition
      ) {
        pIndex = i;
      }
    }

    const allParagraphs = Array.from(document.querySelectorAll("#text > p"));
    let index = 0;
    for (let p of allParagraphs) {
      p?.classList.remove("edit-p");
      if (
        index === pIndex &&
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
      showToPlayers: data[selectedNote]?.showToPlayers || false,
    });
  }, [data, selectedNote]);

  return (
    <div className={`${styles.pageEdit} ${!editMode && styles.height0}`}>
      <label>
        <span data-help={"This is the title of the page"}>Title</span>
        <input
          value={input.title}
          onChange={(e) => handleInput("title", e.currentTarget.value)}
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
          onChange={(e) => handleInput("display", e.currentTarget.value)}
        ></input>
      </label>
      <label>
        <span data-help={"Decide if this note is shown in the tree"}>
          Shown in Tree?
        </span>
        <input
          type="checkbox"
          checked={input.showInTree}
          onChange={(e) => handleInput("showInTree", e.currentTarget.checked)}
        ></input>
      </label>
      <label>
        <span data-help={"Decide if this note is visible to players"}>
          Visible to players?
        </span>
        <input
          type="checkbox"
          checked={input.showToPlayers}
          onChange={(e) =>
            handleInput("showToPlayers", e.currentTarget.checked)
          }
        ></input>
      </label>
      <textarea
        onSelect={handleCursorChange}
        onInput={handleCursorChange}
        value={input.text}
        onChange={(e) => handleInput("text", e.currentTarget.value)}
      ></textarea>
    </div>
  );
};

export default PageEdit;
