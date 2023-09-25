import React, { useContext } from "react";
import styles from "./modal.module.scss";
import { modalContext } from "@/context/modal";
import Button from "../Button/Button";

const Modal = () => {
  const { isVisible, content, closeModal } = useContext(modalContext);
  return (
    <>
      {isVisible && (
        <div className={styles.modalContainer}>
          <div className={styles.modal}>
            <Button
              addClass={styles.closeButton}
              naked={true}
              onClick={closeModal}
            >
              <img width={"2rem"} src="/images/close.svg" />
            </Button>
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
