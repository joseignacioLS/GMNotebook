import React, { useContext, useState } from "react";
import styles from "./createform.module.scss";
import Button from "@/components/Button/Button";
import { getRequest, postRequest } from "@/utils/api";
import { modalContext } from "@/context/modal";
import { useRouter } from "next/router";
import { loginRegex } from "@/utils/constans";

interface Iinput {
  name: { value: string; touched: boolean; valid: boolean };
  password: { value: string; touched: boolean; valid: boolean };
}

function CreateForm({ name }: { name: string }) {
  const [input, setInput] = useState<Iinput>({
    name: {
      value: name,
      touched: false,
      valid: name.match(loginRegex) !== null,
    },
    password: { value: "", touched: false, valid: false },
  });

  const { closeModal } = useContext(modalContext);

  const router = useRouter();

  const checkGame = async () => {
    return await getRequest(`check/${input.name.value}`);
  };

  const handleInput = (key: string, value: string) => {
    setInput((oldvalue) => {
      return {
        ...oldvalue,
        [key]: {
          value,
          touched: true,
          valid: value.match(loginRegex) !== null,
        },
      };
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const gameExists = await checkGame();
    if (gameExists) {
      return;
    }
    const response = await postRequest(
      `create/${input.name.value}`,
      {
        data: {
          RootPage: {
            title: "Main Page",
            key: input.name.value,
            text: "Description",
            display: "rootpage",
            showInTree: true,
          },
        },
        password: input.password.value,
      }
    );
    if (response !== null) {
      setTimeout(() => {
        router.push(`/${input.name.value}`);
        closeModal();
      }, 1000);
    }
  };
  return (
    <div>
      <h2>Create a new game</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={input.name.value}
          onChange={(e) => {
            handleInput("name", e.currentTarget.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={input.password.value}
          onChange={(e) => {
            handleInput("password", e.currentTarget.value);
          }}
        />
        <Button
          onClick={() => {}}
          disabled={!input.name.valid || !input.password.valid}
        >
          Create
        </Button>
      </form>
    </div>
  );
}

export default CreateForm;
