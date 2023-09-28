import React, { useContext, useEffect, useState } from "react";
import styles from "./conections.module.scss";
import { DataContext } from "@/context/data";
import { getTextReferences } from "@/utils/text";
import { NavigationContext } from "@/context/navigation";

const Conections = ({}) => {
  const { item, data, updateSelectedNote } = useContext(DataContext);
  const { path, navigateTo } = useContext(NavigationContext);

  const [references, setReferences] = useState<string[]>([]);

  useEffect(() => {
    setReferences(
      Array.from(
        new Set(
          Object.keys(data).reduce((acc: string[], key: string) => {
            const refes = getTextReferences(data[key].text);
            if (refes.includes(`${item.key}`)) {
              return [...acc, key];
            }
            return acc;
          }, [])
        )
      )
    );
  }, [data, path]);

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
