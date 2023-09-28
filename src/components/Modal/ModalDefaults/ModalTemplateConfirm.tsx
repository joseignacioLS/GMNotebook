import React, { ReactElement, useContext } from "react";
import Button, { behaviourEnum } from "../../Button/Button";
import { modalContext } from "@/context/modal";

import styles from "./modaltemplateconfirm.module.scss";

interface propsI {
  children: string | ReactElement;
  positiveButtonText: string | ReactElement;
  positiveButtonAction: () => void;
}

const ModalTemplateConfirm = ({
  positiveButtonText,
  positiveButtonAction,
  children,
}: propsI) => {
  const { closeModal } = useContext(modalContext);
  return (
    <div className={styles.wrapper}>
      {children}
      <div className={styles.buttons}>
        <Button behaviour={behaviourEnum.NEUTRAL} onClick={closeModal}>
          Close
        </Button>
        <Button
          behaviour={behaviourEnum.NEGATIVE}
          onClick={() => {
            positiveButtonAction();
            closeModal();
          }}
        >
          {positiveButtonText}
        </Button>
      </div>
    </div>
  );
};

export default ModalTemplateConfirm;
