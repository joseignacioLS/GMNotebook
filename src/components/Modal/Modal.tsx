import React, { useContext } from "react";
import styles from "./modal.module.scss";
import { modalContext } from "@/context/modal";
const Modal = () => {
  const { isVisible, content } = useContext(modalContext);
  return (
    <>
      {isVisible && (
        <div className={styles.modalContainer}>
          <div className={styles.modal}>{content}</div>
        </div>
      )}
    </>
  );
};

export default Modal;
