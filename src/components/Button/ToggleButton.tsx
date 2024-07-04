import React, { ReactElement } from "react";
import styles from "./togglebutton.module.scss";
import Button from "./Button";

interface IProps {
  isOn: boolean;
  leftButton?: string | ReactElement;
  rightButton?: string | ReactElement;
  onClick?: any;
}
const ToggleButton: React.FC<IProps> = ({
  isOn,
  leftButton = <div className="roundBlob"></div>,
  rightButton = <div className="roundBlob alert"></div>,
  onClick,
}) => {
  return (
    <Button naked={true} onClick={onClick}>
      <div className={`${styles.wrapper} ${isOn && styles.on}`}>
        <div className={styles.toggleKnob}>
          {isOn ? rightButton : leftButton}
        </div>
      </div>
    </Button>
  );
};

export default ToggleButton;
