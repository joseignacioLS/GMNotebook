import React, { ReactElement, useContext } from "react";
import Button, { behaviourEnum } from "../../Button/Button";
import { modalContext } from "@/context/modal";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        width: "25rem",
        textAlign: "center",
      }}
    >
      {text}

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
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
