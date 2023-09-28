import React from "react";
import styles from "./togglebutton.module.scss";

interface propsI {
  isOn: boolean;
  leftOption: string;
  rightOption: string;
}
const ToggleButton = ({ isOn, leftOption, rightOption }: propsI) => {
  return (
    <div className={styles.wrapper}>
      <span style={{ opacity: isOn ? "1" : ".25" }}>{leftOption}</span>
      <div className={styles.toggleSurface}>
        <div
          className={styles.toggleKnob}
          style={{
            transform: !isOn ? "translateX(2rem)" : "translateX(0px)",
          }}
        ></div>
      </div>
      <span style={{ opacity: !isOn ? "1" : ".25" }}>{rightOption}</span>
    </div>
  );
};

export default ToggleButton;
