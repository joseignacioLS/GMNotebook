import React from "react";
import ToggleButton from "../Button/ToggleButton";
interface IProps {
  value: any;
  onClick: (e: any) => void;
  label: string;
  tooltip: string;
  type?: string;
}
const Input: React.FC<IProps> = ({
  value,
  onClick,
  label,
  tooltip,
  type = "text",
}) => {
  switch (type) {
    case "text":
      return (
        <label>
          <span data-help={tooltip}>{label}</span>
          <input value={value} onChange={onClick} type={type} />
        </label>
      );
    case "checkbox":
      return (
        <label>
          <span data-help={tooltip}>{label}</span>
          <ToggleButton isOn={value} onClick={onClick}></ToggleButton>;
        </label>
      );
  }
};

export default Input;
