import React, { useContext, useState } from "react";
import styles from "./minilogin.module.scss";
import Button, { behaviourEnum } from "@/components/Button/Button";
import { loginToServer } from "@/utils/login";
import { modalContext } from "@/context/modal";
import { DataContext } from "@/context/data";

const MiniLogin = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const { setGmMode, gameName, gmMode } = useContext(DataContext);
  const { closeModal } = useContext(modalContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (await loginToServer(gameName, password)) {
      setGmMode(true);
      closeModal();
    }
  };

  const handleButtonClick = (e: any) => {
    if (gmMode) {
      setGmMode(false);
      setPassword("");
    } else {
      setExpanded((v) => !v);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <input
        className={`${styles.passwordInput} ${expanded && styles.expanded}`}
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />
      <Button
        addClass={`${styles.button} ${expanded && styles.expanded}`}
        behaviour={gmMode ? behaviourEnum.NEGATIVE : behaviourEnum.NEUTRAL}
        onClick={handleButtonClick}
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
