import React from "react";
import ToggleButton from "../Button/ToggleButton";
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
        <label>
          <span data-help={tooltip}>{label}</span>
          <input value={value} onChange={onChange} type={type} />
        </label>
      );
    case "checkbox":
      return (
        <label>
          <span data-help={tooltip}>{label}</span>
          <ToggleButton isOn={value} onClick={onChange}></ToggleButton>;
        </label>
      );
    case "range":
      return (
        <label>
          <span data-help={tooltip}>{label}</span>
          <input type="range" value={value} onChange={onChange} {...config} />
        </label>
      );
  }
};

export default Input;
