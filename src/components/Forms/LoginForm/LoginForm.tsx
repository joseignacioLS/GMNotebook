import React, { useContext, useState } from "react";
import styles from "./loginform.module.scss";
import Button from "@/components/Button/Button";
import { postRequest } from "@/utils/api";
import { DataContext } from "@/context/data";

const LoginForm = () => {
  const [input, setInput] = useState<string>("");
  const { data } = useContext(DataContext);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = postRequest(`http://localhost:4200/login`, {
      name: data.RootPage.key,
      password: input,
    });
  };
  return (
    <div>
      <h2>Game Password</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password"
          value={input}
          onChange={(e) => {
            setInput(e.currentTarget.value);
          }}
        />
        <Button
          onClick={() => {}}
          disabled={input.match(/^[A-Z0-9]{6,18}$/i) === null}
        >
          Create
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
