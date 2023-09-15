import React, { useContext, useEffect, useState } from "react";
import styles from "./Input.module.scss";
import { DataContext, dataI, itemI } from "@/context/data";
import { loadFile, saveToFile } from "@/utils/file";

const checkJSONFormat = (str: string) => {
  try {
    const comillasAdded = addComillasToJSON(str);
    JSON.parse(comillasAdded);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const removeComillas = (str: string) => {
  return str.replace(/\"/g, "");
};

const addComillasToJSON = (str: string) => {
  return str
    .replace(/([\w]+)(\:)/g, '"$1"$2')
    .replace(/(\:[ ]*)([\wñáéíóúüï\\\[\] \-0-9\,\.]+)(,\n|\n *\})/gi, '$1"$2"$3');
};

const Input = () => {
  const processData = (data: dataI | itemI): string => {
    return removeComillas(JSON.stringify(data, undefined, 4));
  };

  const processInput = (input: string): dataI | itemI => {
    try {
      const parsed = JSON.parse(addComillasToJSON(input));
      return parsed as dataI;
    } catch (err) {
      return data as dataI;
    }
  };
  const { data, updateData } = useContext(DataContext);
  const [input, setInput] = useState<string>(processData(data));
  const [isFormatOk, setIsFormatOk] = useState<boolean>(false);
  const [userFilter, setUserFilter] = useState<string>("");

  const saveToContext = () => {
    if (userFilter === "") {
      const processedInput = processInput(input) as dataI;
      updateData(processedInput, true);
      return;
    }
    const processedInput = processInput(input) as itemI;
    updateData({ ...data, [processedInput.key]: processedInput }, true);
  };

  const handleInputChange = (e: any) => {
    setInput(e.currentTarget.value);
  };

  useEffect(() => {
    if (userFilter === "" || data[userFilter] === undefined) {
      setInput(processData(data));
      return;
    }
    setInput(processData(data[userFilter]));
  }, [data]);

  useEffect(() => {
    setIsFormatOk(checkJSONFormat(input));
  }, [input]);

  useEffect(() => {
    if (userFilter === "" || data[userFilter] === undefined) {
      setInput(processData(data));
      return;
    }
    setInput(processData(data[userFilter]));
  }, [userFilter]);

  return (
    <div className={`${styles.inputContainer}`}>
      <select
        value={userFilter}
        onChange={(e) => setUserFilter(e.currentTarget.value)}
      >
        <option value="">-</option>
        {Object.keys(data)
          .sort()
          .map((key: string) => {
            return (
              <option key={key} value={key}>
                {key}
              </option>
            );
          })}
      </select>
      <textarea value={input} onChange={handleInputChange}></textarea>
      <div>
        <button
          className={styles.buttonUpdate}
          onClick={saveToContext}
          disabled={!isFormatOk}
        >
          Update
        </button>
        <button
          className={styles.buttonUpdate}
          disabled={!isFormatOk}
          onClick={() => saveToFile("data.json", data)}
        >
          Download
        </button>
        <input
          type="file"
          id="file"
          className={styles.buttonUpdate}
          onChange={() => {
            loadFile("#file", updateData);
          }}
        />
      </div>
    </div>
  );
};

export default Input;
