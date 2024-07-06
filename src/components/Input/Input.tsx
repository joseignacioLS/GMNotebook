import React from "react";
import ToggleButton from "../Button/ToggleButton";
import styles from "./input.module.scss";
interface IProps {
  value: any;
  onChange: (e: any) => void;
  label: string;
  tooltip?: string;
  type?: string;
  config?: any;
}
const Input: React.FC<IProps> = ({
  value,
  onChange,
  label,
  tooltip,
  type = "text",
  config = {},
}) => {
  switch (type) {
    case "text":
      return (
        <label className={styles.wrapper}>
          <span data-help={tooltip}>{label}</span>
          <input value={value} onChange={onChange} type={type} />
        </label>
      );
    case "checkbox":
      return (
        <label className={styles.wrapper}>
          <span data-help={tooltip}>{label}</span>
          <ToggleButton
            isOn={value}
            onClick={onChange}
            shadow={false}
          ></ToggleButton>
        </label>
      );
    case "range":
      return (
        <label className={styles.wrapper}>
          <span data-help={tooltip}>{label}</span>
          <input type="range" value={value} onChange={onChange} {...config} />
        </label>
      );
  }
};

export default Input;
