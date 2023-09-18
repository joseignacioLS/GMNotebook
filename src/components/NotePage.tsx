import React, { useContext, useEffect } from "react";
import Notes from "./Notes";
import Details from "./Details";

import styles from "./Notepage.module.scss";
import { DataContext } from "@/context/data";
import Conections from "./Conections";
import { loadFile, saveToFile } from "@/utils/file";
import { textPieceI } from "@/context/constants";

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
          <Notes />
          <div
            style={{
              height: "100%",
              width: "1px",
              backgroundColor: "black",
              gridArea: "sep",
            }}
          ></div>
          <Details />
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
        <button
          id="btn-download"
          className="button"
          onClick={() => saveToFile("data.json", data)}
        >
          <img src="/images/download.svg" />
        </button>
        <button className="button" id="btn-reset" onClick={resetData}>
          <img src="/images/reset.svg" />
        </button>
      </div>
    </div>
  );
};

export default NotePage;
