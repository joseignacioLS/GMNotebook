import React, { ReactElement } from "react";
import styles from "./togglebutton.module.scss";
import Button from "./Button";

interface IProps {
  isOn: boolean;
  leftOption?: string;
  rightOption?: string;
  leftButton?: string | ReactElement;
  rightButton?: string | ReactElement;
  onClick?: any;
}
const ToggleButton: React.FC<IProps> = ({
  isOn,
  leftOption,
  rightOption,
  leftButton = <div className="roundBlob alert"></div>,
  rightButton = <div className="roundBlob"></div>,
  onClick,
}) => {
  return (
    <Button naked={true} onClick={onClick}>
      <div className={styles.wrapper}>
        <span style={{ opacity: isOn ? "1" : ".25" }}>{leftOption}</span>
        <div className={styles.toggleSurface}>
          <div
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
    </Button>
  );
};

export default ToggleButton;
