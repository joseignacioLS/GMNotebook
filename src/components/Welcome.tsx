import React, { useContext, useState } from "react";
import styles from "./welcome.module.scss";
import { useRouter } from "next/router";
import Button, { behaviourEnum } from "./Button/Button";
import { modalContext } from "@/context/modal";
import { getRequest } from "@/utils/api";
import CreateForm from "./Forms/CreateForm/CreateForm";
import Spinner from "./Spinner/Spinner";

const Welcome = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");

  const { setContent } = useContext(modalContext);

  const [loading, setLoading] = useState<boolean>(false);

  const checkGame = async () => {
    const res = await getRequest(`check/${input}`);
    return res;
  };

  const handleClick = async (e: any) => {
    e.preventDefault();

    if (input === "") return;
    setLoading(true);
    const gameExists = await checkGame();
    setLoading(false);
    if (gameExists) {
      return router.push(`/${input}`);
    }
    // open the other modal
    setContent(<CreateForm name={input} />);
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Spinner />
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
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
    </div>
  );
};

export default Welcome;
