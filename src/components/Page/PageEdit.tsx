import React, { useContext, useEffect, useState } from "react";
import styles from "./pageedit.module.scss";
import { DataContext } from "@/context/data";
import { extractReferences } from "@/utils/text";
import Input from "../Input/Input";
import { processCommands } from "@/utils/commands";

const PageEdit: React.FC = () => {
  const { data, updateData, editMode, selectedNote } = useContext(DataContext);
  const [input, setInput] = useState<{
    title: string;
    text: string;
    display: string;
    showInTree: boolean;
    showInTabs: boolean;
  }>({
    text: data[selectedNote]?.text || "",
    title: data[selectedNote]?.title || "",
    display: data[selectedNote]?.display || "",
    showInTree: data[selectedNote]?.showInTree || false,
    showInTabs: data[selectedNote]?.showInTabs || false,
  });

  const handleUpdateData = (
    target: HTMLElement,
    key: string,
    value: string | boolean
  ) => {
    if (key === "text") value = processCommands(target, value as string);
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
  }, [
    input.text,
    input.display,
    input.title,
    input.showInTree,
    input.showInTabs,
  ]);

  useEffect(() => {
    const newInput = {
      text: data[selectedNote]?.text || "",
      title: data[selectedNote]?.title || "",
      display: data[selectedNote]?.display || "",
      showInTree: data[selectedNote]?.showInTree || false,
      showInTabs: data[selectedNote]?.showInTabs || false,
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

  return (
    <div className={`${styles.pageEdit} ${!editMode && styles.height0}`}>
      <Input
        value={input.title}
        onChange={(e) =>
          handleUpdateData(e.target, "title", e.currentTarget.value)
        }
        label={"Title"}
        tooltip={"This is the title of the page"}
      />
      <Input
        value={input.display}
        onChange={(e) =>
          handleUpdateData(e.target, "display", e.currentTarget.value)
        }
        label={"Display"}
        tooltip={
          "This will substitute the note:keyword wherever this page is referenced as a note."
        }
      />
      <Input
        value={input.showInTree}
        onChange={(e) =>
          handleUpdateData(e.target, "showInTree", !input.showInTree)
        }
        label={" Show in tree?"}
        tooltip={"Decide if this note is shown in the tree"}
        type="checkbox"
      />
      <Input
        value={input.showInTabs}
        onChange={(e) =>
          handleUpdateData(e.target, "showInTabs", !input.showInTabs)
        }
        label={" Show in tabs?"}
        tooltip={"Decide if this note is shown in the tabs"}
        type="checkbox"
      />
      <textarea
        onInput={(e) => {
          e.preventDefault();
          handleUpdateData(e.target as any, "text", e.currentTarget.value);
        }}
        value={input.text}
      ></textarea>
    </div>
  );
};

export default PageEdit;
