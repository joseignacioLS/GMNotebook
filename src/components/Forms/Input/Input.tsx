import React from "react";
import styles from "./input.module.scss";
const Input = ({
  type,
  value,
  onChange,
  onInput,
}: {
  type: string;
  value: string | number;
  onChange?: any;
  onInput?: any;
}) => {
  return (
    <input
      className={styles.input}
      value={value}
      type={type}
      onChange={onChange}
      onInput={onInput}
    />
  );
};

export default Input;
