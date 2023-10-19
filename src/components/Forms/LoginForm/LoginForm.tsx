import React, { useContext, useState } from "react";
import styles from "./loginform.module.scss";
import Button from "@/components/Button/Button";
import { DataContext } from "@/context/data";
import { modalContext } from "@/context/modal";
import { loginToServer } from "@/utils/login";
import { loginRegex } from "@/utils/constans";

const LoginForm = () => {
  const [input, setInput] = useState<string>("");
  const { setGmMode, gameName } = useContext(DataContext);
  const { closeModal } = useContext(modalContext);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (await loginToServer(gameName, input)) {
      setGmMode(true);
      closeModal();
    }
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
        <Button onClick={() => {}} disabled={input.match(loginRegex) === null}>
          Create
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
