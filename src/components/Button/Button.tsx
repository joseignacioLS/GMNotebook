import React, { ReactElement } from "react";
import styles from "./button.module.scss";

export enum behaviourEnum {
  POSITIVE,
  NEUTRAL,
  NEGATIVE,
}

const bgColorDictionary: { [key in behaviourEnum]: string } = {
  [behaviourEnum.POSITIVE]: "aquamarine",
  [behaviourEnum.NEUTRAL]: "lightgrey",
  [behaviourEnum.NEGATIVE]: "lightcoral",
};

interface propsI {
  children: ReactElement | string;
  behaviour?: behaviourEnum;
  naked?: boolean;
  onClick: (e: any) => void;
  addClass?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  behaviour = behaviourEnum.NEUTRAL,
  naked,
  onClick,
  addClass,
  disabled = false,
}: propsI) => {
  return (
    <button
      style={{
        backgroundColor: naked ? "transparent" : bgColorDictionary[behaviour],
        borderRadius: naked ? "0" : ".5rem",
        padding: naked ? "0" : ".5rem",
      }}
      className={`${styles.button} ${addClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
