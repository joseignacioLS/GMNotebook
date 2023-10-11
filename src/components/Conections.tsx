import React, { useContext, useEffect, useState } from "react";
import styles from "./conections.module.scss";
import { DataContext } from "@/context/data";
import { extractReferences } from "@/utils/text";
import { NavigationContext } from "@/context/navigation";
import { dataI, itemI } from "@/context/constants";

const generateUniqueReferences = (data: dataI, item: itemI) => {
  return Array.from(
    new Set(
      Object.keys(data).reduce((acc: string[], key: string) => {
        const refes = extractReferences(data[key].text);
        if (refes.map((refe) => refe.split("_")[0]).includes(`${item.key}`)) {
          return [...acc, key];
        }
        return acc;
      }, [])
    )
  );
};

const Conections = ({}) => {
  const { item, data, updateSelectedNote } = useContext(DataContext);
  const { path, navigateTo } = useContext(NavigationContext);

  const [references, setReferences] = useState<string[]>([]);

  useEffect(() => {
    setReferences(generateUniqueReferences(data, item));
  }, [data, item, path]);

  return (
    <div className={styles.conectionsContainer}>
      <h2 className={styles.title}>Appears in:</h2>
      <div className={styles.refsContainer}>
        {references?.map((ref: string) => {
          if (ref === item.key) return;
          return (
            <span
              key={ref}
              onClick={() => {
                navigateTo(ref);
                updateSelectedNote(ref);
              }}
            >
              {data[ref]?.title}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Conections;
