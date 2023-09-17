import React, { useContext } from "react";
import styles from "./Conections.module.scss";
import { DataContext } from "@/context/data";
import { getTextReferences, removeBrackets } from "@/utils/text";
import { NavigationContext } from "@/context/navigation";

const Conections = ({ itemKey }: { itemKey: string }) => {
  const { data, includeRerencesInText } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);

  const references = Array.from(
    new Set(
      Object.keys(data).reduce((acc: string[], key: string) => {
        const text = getTextReferences(includeRerencesInText(data[key].text));
        if (text?.join("").includes(`[${itemKey}]`)) {
          return [...acc, key];
        }
        return acc;
      }, [])
    )
  );

  return (
    <div className={styles.conectionsContainer}>
      {references.length > 0 && (
        <>
          <h2 className={styles.title}>Appears in:</h2>
          {
            <div className={styles.refsContainer}>
              {references?.map((ref: string) => {
                const key = removeBrackets(ref);
                if (key === itemKey) return;
                return (
                  <span
                    key={key}
                    onClick={() => {
                      navigateTo(key);
                    }}
                  >
                    {data[key]?.title}
                  </span>
                );
              })}
            </div>
          }
        </>
      )}
    </div>
  );
};

export default Conections;
