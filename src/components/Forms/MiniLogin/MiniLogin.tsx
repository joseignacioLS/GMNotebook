import React, { useContext, useState } from "react";
import styles from "./minilogin.module.scss";
import Button, { behaviourEnum } from "@/components/Button/Button";
import { loginToServer } from "@/utils/login";
import { DataContext } from "@/context/data";

const MiniLogin = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const { setGmMode, gameName, gmMode } = useContext(DataContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (gmMode) {
      return setGmMode(false);
    }
    if (!expanded) {
      return setExpanded(true);
    }
    alert(gameName)
    alert(password)
    const response: boolean = await loginToServer(gameName, password);
    alert(response)
    if (response) {
      setGmMode(true);
      setExpanded(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
    setPassword("");
  };

  const handleInput = (value: string) => {
    setPassword(value);
    if (value === "") {
      setExpanded(false);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <input
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
        ${error && styles.buzz}`}
        behaviour={gmMode ? behaviourEnum.NEGATIVE : behaviourEnum.NEUTRAL}
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
