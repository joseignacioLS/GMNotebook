import React, { useContext } from "react";
import styles from "./modal.module.scss";
import { modalContext } from "@/context/modal";
import Button from "../Button/Button";

const Modal: React.FC = () => {
  const { isVisible, content, closeModal } = useContext(modalContext);

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  };
  if (!isVisible) return <></>;
  return (
    <div className={styles.modalContainer} onClick={handleClose}>
      <div
        className={styles.modal}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Button
          addClass={styles.closeButton}
          naked={true}
          onClick={handleClose}
        >
          <span className={styles["material-symbols-outlined"]}>close</span>
        </Button>
        {content}
      </div>
    </div>
  );
};

export default Modal;
