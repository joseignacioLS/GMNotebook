import React, { ReactElement } from "react";
import styles from "./togglebutton.module.scss";

interface propsI {
  isOn: boolean;
  leftOption?: string;
  rightOption?: string;
  leftButton?: string | ReactElement;
  rightButton?: string | ReactElement;
  onClick?: () => void;
}
const ToggleButton = ({
  isOn,
  leftOption,
  rightOption,
  leftButton,
  rightButton,
  onClick,
}: propsI) => {
  return (
    <div className={styles.wrapper}>
      <span style={{ opacity: isOn ? "1" : ".25" }}>{leftOption}</span>
      <div className={styles.toggleSurface}>
        <div
          onClick={onClick}
          className={styles.toggleKnob}
          style={{
            transform: isOn ? "translateX(2rem)" : "translateX(0px)",
          }}
        >
          {isOn ? rightButton : leftButton}
        </div>
      </div>
      <span style={{ opacity: !isOn ? "1" : ".25" }}>{rightOption}</span>
    </div>
  );
};

export default ToggleButton;
