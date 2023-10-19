import React, { useContext, useState } from "react";
import styles from "./minilogin.module.scss";
import Button, { behaviourEnum } from "@/components/Button/Button";
import { loginToServer } from "@/utils/login";
import { DataContext } from "@/context/data";

const MiniLogin = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setGmMode, gameName, gmMode, updateEditMode } =
    useContext(DataContext);

  const turnOffGmMode = () => {
    updateEditMode(false);
    setGmMode(false);
  };

  const expandInputAndFocus = () => {
    const element = document.querySelector("#input-password") as any;
    element?.focus();
    setExpanded(true);
  };

  const makeLoginRequest = async () => {
    setLoading(true);
    const response: boolean = await loginToServer(gameName, password);
    setLoading(false);

    if (response) {
      setGmMode(true);
      setExpanded(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (gmMode) {
      return turnOffGmMode();
    }
    if (!expanded) {
      return expandInputAndFocus();
    }

    makeLoginRequest();
    setPassword("");
  };

  const handleInput = (value: string) => {
    if (!expanded || loading) return;
    setPassword(value);
    if (value === "") {
      setExpanded(false);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <input
        id={"input-password"}
        className={`${styles.passwordInput} 
        ${expanded && styles.expanded}`}
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => {
          handleInput(e.currentTarget.value);
        }}
      />
      <Button
        addClass={`${styles.button} 
        ${expanded && styles.expanded}  
        ${error && styles.buzz} 
        ${loading && styles.rotate}`}
        behaviour={gmMode ? behaviourEnum.POSITIVE : behaviourEnum.NEUTRAL}
        onClick={() => {}}
      >
        {gmMode ? (
          <img src="/images/unlocked.svg" />
        ) : (
          <img src="/images/locked.svg" />
        )}
      </Button>
    </form>
  );
};

export default MiniLogin;
