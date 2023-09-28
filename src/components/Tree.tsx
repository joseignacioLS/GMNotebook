import React, { ReactElement, useContext, useEffect } from "react";
import styles from "./tree.module.scss";
import { DataContext } from "@/context/data";
import { leafI } from "@/context/constants";
import { generateColor } from "@/utils/color";
import { NavigationContext } from "@/context/navigation";
import { modalContext } from "@/context/modal";
import { relaxTree } from "@/utils/tree";

const Tree = () => {
  const { data, tree, setTree, updateSelectedNote } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);
  const { closeModal } = useContext(modalContext);

  const relaxTreeMore = (): void => {
    setTree((oldValue: leafI[]) => relaxTree(oldValue));
  };

  const relaxTreeForFirstVisualization = (): void => {
    let relaxedTree = tree;
    for (let i = 0; i < 5000; i++) {
      relaxedTree = relaxTree(relaxedTree);
    }
    setTree(relaxedTree);
  };

  useEffect(() => {
    relaxTreeForFirstVisualization();
    const interval = setInterval(relaxTreeMore, 50);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className={styles.treeContainer}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {tree.reduce((acc: ReactElement[], curr: leafI) => {
          return [
            ...acc,
            ...curr.children.map((index) => {
              const origin = curr.position;
              const destiny = tree[index].position;
              return (
                <path
                  key={curr.key + index}
                  d={`M${origin[0]} ${origin[1]} L${destiny[0]} ${destiny[1]}Z`}
                  stroke="black"
                />
              );
            }),
          ];
        }, [])}
      </svg>
      {tree.map((leaf: leafI) => {
        const color = generateColor(leaf.key);
        return (
          <span
            key={leaf.key}
            className={styles.leaf}
            style={{
              left: leaf.position[0] + "%",
              top: leaf.position[1] + "%",
              backgroundColor: color,
            }}
            onClick={() => {
              closeModal();
              updateSelectedNote(leaf.key);
              navigateTo(leaf.key);
            }}
          >
            {data[leaf.key]?.title || "error"}
          </span>
        );
      })}
    </div>
  );
};

export default Tree;
