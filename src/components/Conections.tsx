import React, { useContext } from "react";
import styles from "./Conections.module.scss";
import { DataContext } from "@/context/data";
import { getTextReferences, includeRerencesInText } from "@/utils/text";
import { useRouter } from "next/router";

const Conections = ({ itemKey }: { itemKey: string }) => {
  const { data, updateItem } = useContext(DataContext);
  const router = useRouter();

  const references = Array.from(
    new Set(
      Object.keys(data).reduce((acc: string[], key: string) => {
        const text = getTextReferences(
          includeRerencesInText(data[key].text, data)
        );
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
                const key = ref.replace(/[\[\]]/g, "");
                if (key === itemKey) return;
                return (
                  <span
                    key={key}
                    onClick={() => {
                      updateItem(key);
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
