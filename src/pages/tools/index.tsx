import Modal from "@/components/Modal/Modal";
import { useContext, useState } from "react";
import { darkModeContext } from "@/context/darkmode";
import Input from "@/components/Forms/Input/Input";

import styles from "./tools.module.scss";

const table = [
  { CR: 0, pB: 2, AC: 13, HP: 6, Attack: 3, dmg: 1, DC: 13 },
  { CR: 0.125, pB: 2, AC: 13, HP: 35, Attack: 3, dmg: 3, DC: 13 },
  { CR: 0.25, pB: 2, AC: 13, HP: 49, Attack: 3, dmg: 5, DC: 13 },
  { CR: 0.5, pB: 2, AC: 13, HP: 70, Attack: 3, dmg: 8, DC: 13 },
  { CR: 1, pB: 2, AC: 13, HP: 85, Attack: 3, dmg: 14, DC: 13 },
  { CR: 2, pB: 2, AC: 13, HP: 100, Attack: 3, dmg: 20, DC: 13 },
  { CR: 3, pB: 2, AC: 13, HP: 115, Attack: 4, dmg: 26, DC: 13 },
  { CR: 4, pB: 2, AC: 14, HP: 130, Attack: 5, dmg: 32, DC: 14 },
  { CR: 5, pB: 3, AC: 15, HP: 145, Attack: 6, dmg: 38, DC: 15 },
  { CR: 6, pB: 3, AC: 15, HP: 160, Attack: 6, dmg: 44, DC: 15 },
  { CR: 7, pB: 3, AC: 15, HP: 175, Attack: 6, dmg: 50, DC: 15 },
  { CR: 8, pB: 3, AC: 16, HP: 190, Attack: 7, dmg: 56, DC: 16 },
];

const xpPoints: { [key: number]: number } = {
  0: 10,
  0.125: 25,
  0.25: 50,
  0.5: 100,
  1: 200,
  2: 450,
  3: 700,
  4: 1100,
  5: 1800,
  6: 2300,
  7: 2900,
  8: 3900,
  9: 5000,
  10: 5900,
  11: 7200,
  12: 8400,
  13: 1000,
};

enum inputNames {
  "AC",
  "HP",
  "Attack",
  "Dmg",
  "DC",
}

interface inputI {
  name: inputNames;
  type: string | "number";
}

const inputs: inputI[] = [
  { name: inputNames.AC, type: "number" },
  { name: inputNames.HP, type: "number" },
  { name: inputNames.Attack, type: "number" },
  { name: inputNames.Dmg, type: "number" },
  { name: inputNames.DC, type: "number" },
];

export default function Home() {
  const { darkMode } = useContext(darkModeContext);
  const [inputValues, setInputValues] = useState<{
    [key in inputNames]: number;
  }>({
    [inputNames.AC]: 13,
    [inputNames.HP]: 6,
    [inputNames.Attack]: 3,
    [inputNames.Dmg]: 1,
    [inputNames.DC]: 13,
  });
  const [CR, setCR] = useState([0, 0, 0]);

  const [dice, setDice] = useState(6);
  const [mod, setMod] = useState(0);

  const handleInput = (key: inputNames, value: number) => {
    setInputValues((v) => {
      const newValue = { ...v, [key]: value };
      calculateCR(newValue);
      return newValue;
    });
  };

  const calculateCR = (inputs: {
    [key in inputNames]: number;
  }) => {
    let hpRating = 0;
    let dmgRating = 0;
    for (let i = 0; i <= table.length; i++) {
      hpRating = i;
      if (inputs[inputNames.HP] <= table[i].HP) {
        break;
      }
    }

    for (let i = 0; i <= table.length; i++) {
      dmgRating = i;
      if (inputs[inputNames.Dmg] <= table[i].dmg) {
        break;
      }
    }

    const preDeltaAC = inputs[inputNames.AC] - table[hpRating].AC;
    const deltaAC =
      preDeltaAC !== 0
        ? (Math.abs(preDeltaAC) / preDeltaAC) *
          Math.floor(Math.abs(preDeltaAC) / 2)
        : 0;
    const defRating = table[hpRating].CR + deltaAC;

    const deltaAttack = Math.floor(
      (inputs[inputNames.Attack] - table[dmgRating].Attack) / 2
    );
    const offRatting = table[dmgRating].CR + deltaAttack;

    let final = 0;
    const combinedRatting =
      (defRating + offRatting) / 2 >= 1
        ? Math.ceil((defRating + offRatting) / 2)
        : Math.round(((defRating + offRatting) / 2) * 8) / 8;
    for (let i = 0; i <= table.length; i++) {
      final = i;
      if (combinedRatting <= table[i].CR) {
        break;
      }
    }
    setCR([table[final].CR, defRating, offRatting]);
  };

  const calculateDiceAvg = (
    value: number = 10,
    dice: number = 10,
    mod: number = 0,
    total: number = 0
  ): number => {
    if (value === 0) {
      return total / dice + mod;
    }
    return calculateDiceAvg(value - 1, dice, mod, total + value);
  };

  return (
    <main
      style={{
        background: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }}
      className={styles.main}
    >
      <div
        className={styles.block}
        style={{
          gridArea: "cr",
        }}
      >
        <h2>CR Calculator</h2>
        <p>
          CR: {CR[0]} (Def:{CR[1]} / Off:{CR[2]})
        </p>
        <p>XP: {xpPoints[CR[0]] || 0}</p>
        <form className={styles.form}>
          {inputs.map(({ name, type }) => {
            return (
              <label key={name}>
                <span>{inputNames[name]}</span>
                <Input
                  value={inputValues[name]}
                  type={type}
                  onChange={(e: any) => {
                    handleInput(name, +e.currentTarget.value);
                  }}
                ></Input>
              </label>
            );
          })}
        </form>
      </div>
      <div
        className={styles.block}
        style={{
          gridArea: "dice",
        }}
      >
        <h2>Dice average</h2>
        <p>
          1d{dice} + ({mod}) = {calculateDiceAvg(dice, dice, mod, 0)}
        </p>
        <form className={styles.form}>
          <label>
            <span>Dice </span>
            <Input
              type={"number"}
              value={dice}
              onChange={(e: any) => {
                setDice(+e.currentTarget.value);
              }}
            />
          </label>
          <label>
            <span>Mod </span>
            <Input
              type={"number"}
              value={mod}
              onChange={(e: any) => {
                setMod(+e.currentTarget.value);
              }}
            />
          </label>
        </form>
      </div>

      <Modal />
    </main>
  );
}
