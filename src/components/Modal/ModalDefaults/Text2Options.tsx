import React, { ReactElement, useContext } from "react";
import Button, { behaviourEnum } from "../../Button/Button";
import { modalContext } from "@/context/modal";

import styles from "./text2options.module.scss";

interface propsI {
  text: string | ReactElement | ReactElement[];
  positiveButtonText: string | ReactElement;
  positiveButtonAction: () => void;
}

const Text2Options = ({
  text,
  positiveButtonText,
  positiveButtonAction,
}: propsI) => {
  const { closeModal } = useContext(modalContext);
  return (
    <div className={styles.wrapper}>
      {text}

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

export default Text2Options;
