import React, { useState } from "react";
import styles from "./welcome.module.scss";
import { useRouter } from "next/router";
import Button, { behaviourEnum } from "./Button/Button";

const Welcome = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");

  const handleClick = (e: any) => {
    e.preventDefault();
    if (input === "") return;
    router.push(`/${input}`);
  };
  return (
    <form className={styles.welcome} onSubmit={handleClick}>
      <h1>Welcome to the GMNotebook</h1>
      <input
        type="text"
        placeholder="Write your game name"
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
      ></input>
      <Button onClick={() => {}} behaviour={behaviourEnum.POSITIVE}>
        Entrar
      </Button>
    </form>
  );
};

export default Welcome;
