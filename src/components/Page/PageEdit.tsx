import React, { useCallback, useContext, useEffect, useState } from "react";
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

  const handleUpdateData = (key: string, value: string | boolean) => {
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
    updateData({ [data[selectedNote].key]: newItem, ...newEntries }, false);
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
    const newInput = {
      text: data[selectedNote]?.text || "",
      title: data[selectedNote]?.title || "",
      display: data[selectedNote]?.display || "",
      showInTree: data[selectedNote]?.showInTree || false,
    };
    if (
      Object.keys(input).some((key: string) => {
        const typedKey = key as keyof typeof input;
        return input[typedKey] !== newInput[typedKey];
      })
    ) {
      setInput(newInput);
    }
  }, [selectedNote]);

  useEffect(() => {
    return removeSelectedParagraph;
  }, []);
  return (
    <div className={`${styles.pageEdit} ${!editMode && styles.height0}`}>
      <Input
        value={input.title}
        onChange={(e) => handleUpdateData("title", e.currentTarget.value)}
        label={"Title"}
        tooltip={"This is the title of the page"}
      />
      <Input
        value={input.display}
        onChange={(e) => handleUpdateData("display", e.currentTarget.value)}
        label={"Display"}
        tooltip={
          "This will substitute the note:keyword wherever this page is referenced as a note."
        }
      />
      <Input
        value={input.showInTree}
        onChange={(e) => handleUpdateData("showInTree", !input.showInTree)}
        label={" Show in tree?"}
        tooltip={"Decide if this note is shown in the tree"}
        type="checkbox"
      />
      <textarea
        onSelect={handleCursorChange}
        onInput={(e) => {
          handleCursorChange(e);
          handleUpdateData("text", e.currentTarget.value);
        }}
        value={input.text}
      ></textarea>
    </div>
  );
};

export default PageEdit;
