import React, { useContext } from "react";
import styles from "./modal.module.scss";
import { modalContext } from "@/context/modal";
import Button from "../Button/Button";

const Modal = () => {
  const { isVisible, content, closeModal } = useContext(modalContext);
  if (!isVisible) return;
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <Button addClass={styles.closeButton} naked={true} onClick={closeModal}>
          <img src="/images/close.svg" />
        </Button>
        {content}
      </div>
    </div>
  );
};

export default Modal;
