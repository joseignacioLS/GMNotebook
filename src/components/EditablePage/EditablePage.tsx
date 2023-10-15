import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./editablepage.module.scss";
import { DataContext } from "@/context/data";
import { processText } from "@/utils/text";

const EditablePage = () => {
  const { item } = useContext(DataContext);
  const inputRef = useRef(null);
  const [text, setText] = useState<any>("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const getCaret = () => {
    let caretAt = 0;
    const sel = window.getSelection();

    if (sel?.rangeCount == 0) {
      setCursorPosition(caretAt);
      return;
    }

    const range = sel?.getRangeAt(0);
    if (!range) {
      setCursorPosition(caretAt);
      return;
    }
    const preRange = range.cloneRange();
    preRange.selectNodeContents(inputRef.current);
    preRange.setEnd(range.endContainer, range.endOffset);
    caretAt = preRange.toString().length;

    setCursorPosition(caretAt);
  };
  const setCaret = (element: any, position: number) => {
    // Loop through all child nodes
    for (let node of element.childNodes) {
      if (node.nodeType == 3) {
        // we have a text node
        if (node.length >= position) {
          // finally add our range
          const range = document.createRange(),
            sel = window.getSelection();
          range.setStart(node, position);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
          return -1; // we are done
        } else {
          position -= node.length;
        }
      } else {
        position = setCaret(node, position);
        if (position == -1) {
          return -1; // no need to finish the for loop
        }
      }
    }
    return position; // needed because of recursion stuff
  };

  useEffect(() => {
    setCaret(inputRef.current, cursorPosition);
  }, [text]);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        document.execCommand("insertLineBreak");
        event.preventDefault();
      }
    });
  }, []);

  useEffect(() => {
    const newText = processText(item.text);
    setText(newText);
    setCursorPosition(0);
  }, [item]);

  return (
    <div
      className={styles.input}
      ref={inputRef}
      contentEditable
      onInput={(e) => {
        getCaret();
        setText(inputRef.current.innerHTML);
      }}
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    ></div>
  );
};

export default EditablePage;
