import React, { useContext, useState } from "react";
import styles from "./welcome.module.scss";
import { useRouter } from "next/router";
import Button, { behaviourEnum } from "./Button/Button";
import { modalContext } from "@/context/modal";
import { getRequest } from "@/utils/api";
import CreateForm from "./Forms/CreateForm/CreateForm";

const Welcome = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");

  const { setContent } = useContext(modalContext);

  const checkGame = async () => {
    return await getRequest(`check/${input}`);
  };

  const handleClick = async (e: any) => {
    e.preventDefault();

    if (input === "") return;
    const gameExists = await checkGame();
    if (gameExists) {
      return router.push(`/${input}`);
    }
    // open the other modal
    setContent(<CreateForm name={input} />);
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
