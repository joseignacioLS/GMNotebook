import React, { useContext, useEffect, useState } from "react";
import Notes from "./Notes";
import Details from "./Details";

import styles from "./notepage.module.scss";
import { textPieceI } from "@/context/data";
import { DataContext } from "@/context/data";
import Conections from "./Conections";
import { loadFile, saveToFile } from "@/utils/file";

const checkItemVisibility = (id: string) => {
  const boundingRect = document
    .querySelector(`#${id}`)
    ?.getBoundingClientRect();
  if (!boundingRect) return false;
  const notesContainer = document.querySelector("#notes") as any;
  const titleSpace = 80;
  return (
    boundingRect.top >= titleSpace &&
    boundingRect.top <= (notesContainer?.offsetHeight || 0) + titleSpace
  );
};

const NotePage = () => {
  const { data, item, textPieces, updateTextPieces, updateData, resetData } =
    useContext(DataContext);
  const [selectedNote, setSelectedNote] = useState<string | undefined>(
    undefined
  );

  const updateVisibleReferences = () => {
    let visibleIndex = 0;
    updateTextPieces((oldValue: textPieceI[]) => {
      return oldValue.map((ref: textPieceI) => {
        if (ref.key === undefined) return ref;
        visibleIndex += 1;
        const visible = checkItemVisibility(ref?.id || "");
        const newRef = {
          ...ref,
          visible,
        } as textPieceI;
        return newRef;
      }) as textPieceI[];
    });
  };

  useEffect(() => {
    document
      .querySelector("#notes")
      ?.addEventListener("scroll", updateVisibleReferences);
    return () =>
      document
        .querySelector("#notes")
        ?.removeEventListener("scroll", updateVisibleReferences);
  }, [textPieces, updateVisibleReferences]);

  return (
    <div className={styles.notepage}>
      {item && (
        <>
          <Notes
            title={item.title}
            text={textPieces}
            setSelectedNote={setSelectedNote}
          />
          <div
            style={{
              height: "100%",
              width: "1px",
              backgroundColor: "black",
              gridArea: "sep",
            }}
          ></div>
          <Details
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
          />
          <Conections itemKey={item?.key} />
        </>
      )}{" "}
      <div className={styles.buttons}>
        <input
          type="file"
          id="file"
          onChange={() => {
            loadFile("#file", updateData);
          }}
        />
        <button onClick={() => saveToFile("data.json", data)}>🔽</button>
        <button onClick={resetData}>🔃</button>
      </div>
    </div>
  );
};

export default NotePage;
