import React from "react";
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
  return (
    <label>
      <span data-help={tooltip}>{label}</span>
      <input value={value} onChange={onClick} type={type} />
    </label>
  );
};

export default Input;
