import React, { ReactElement } from "react";
import styles from "./togglebutton.module.scss";
import Button from "./Button";

interface IProps {
  isOn: boolean;
  leftButton?: string | ReactElement;
  rightButton?: string | ReactElement;
  onClick?: any;
  shadow?: boolean;
}
const ToggleButton: React.FC<IProps> = ({
  isOn,
  leftButton = (
    <span className={`${styles["material-symbols-outlined"]} noShadow`}>
      close
    </span>
  ),
  rightButton = (
    <span
      className={`${styles["material-symbols-outlined"]} color-confirm noShadow`}
    >
      check
    </span>
  ),
  onClick,
  shadow = true,
}) => {
  return (
    <Button naked={true} onClick={onClick}>
      <div
        className={`${styles.wrapper} ${isOn && styles.on} ${
          !shadow && "noShadow"
        }`}
      >
        <div className={styles.toggleKnob}>
          {isOn ? rightButton : leftButton}
        </div>
      </div>
    </Button>
  );
};

export default ToggleButton;
