import React, { useContext, useEffect, useState } from "react";
import Notes from "./Notes";
import Details from "./Details";

import styles from "./notepage.module.scss";
import { itemI, referenceI } from "@/api/data";
import {
  getTextReferences,
  includeRerencesInText,
  splitTextIntoReferences,
} from "@/utils/text";
import { DataContext } from "@/context/data";
import Link from "next/link";
import Conections from "./Conections";

const checkItemVisibility = (id: string) => {
  const boundingRect = document
    .querySelector(`#${id}`)
    ?.getBoundingClientRect();
  if (!boundingRect) return false;
  return (
    boundingRect.top >= 0 &&
    boundingRect.bottom <= (document.querySelector("#notes")?.scrollHeight || 0)
  );
};

const NotePage = () => {
  const { data, item } = useContext(DataContext);
  const [text, setText] = useState<string>(item?.text || "");
  const [references, setReferences] = useState<referenceI[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!item?.text || !data) return;
    const referenceText = includeRerencesInText(item.text, data, [item.key]);
    setText(referenceText);
    const references = getTextReferences(referenceText);
    if (!references) return setReferences([]);
    const refes = splitTextIntoReferences(references, referenceText, data);
    setReferences(refes);
    setTimeout(updateVisibleReferences, 50);
  }, [item?.text, data]);

  const updateVisibleReferences = () => {
    setReferences((oldValue: referenceI[]) => {
      return oldValue.map((ref: referenceI) => {
        const visible = checkItemVisibility(ref?.id);
        return { ...ref, visible };
      });
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
  }, [item?.text]);

  return (
    <div className={styles.notepage}>
      {item && (
        <>
          <Notes
            title={item.title}
            text={text}
            references={references}
            setSelectedNote={setSelectedNote}
          />
          <div
            style={{
              height: "100%",
              width: "1px",
              backgroundColor: "black",
              gridColumn: "2/3",
              gridRow: "1/3",
            }}
          ></div>
          <Details
            references={references}
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
          />
          <Conections itemKey={item?.key} />
        </>
      )}
      <Link className={styles.editLink} href="/edit">
        ✏️
      </Link>
    </div>
  );
};

export default NotePage;
