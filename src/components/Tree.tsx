import React, { ReactElement, useContext, useEffect } from "react";
import styles from "./tree.module.scss";
import { DataContext } from "@/context/data";
import { ILeaf } from "@/context/constants";
import { NavigationContext } from "@/context/navigation";
import { modalContext } from "@/context/modal";
import { relaxTree } from "@/utils/tree";
import { colorContext } from "@/context/colors";

const Tree: React.FC = () => {
  const { data, tree, setTree, updateSelectedNote } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);
  const { closeModal } = useContext(modalContext);
  const { generateColor } = useContext(colorContext);

  const relaxTreeMore = (): void => {
    setTree((oldValue: ILeaf[]) => relaxTree(oldValue));
  };

  const relaxTreeForFirstVisualization = (): void => {
    let relaxedTree = tree;
    for (let i = 0; i < 10000; i++) {
      relaxedTree = relaxTree(relaxedTree);
    }
    setTree(relaxedTree);
  };

  useEffect(() => {
    relaxTreeForFirstVisualization();
    const interval = setInterval(relaxTreeMore, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.treeContainer}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {tree.reduce((acc: ReactElement[], curr: ILeaf) => {
          return [
            ...acc,
            ...Array.from(new Set(curr.children)).map((index) => {
              const origin = curr.position;
              const destiny = tree[index].position;
              return (
                <path
                  key={curr.key + tree[index].key}
                  d={`M${origin[0]} ${origin[1]} L${destiny[0]} ${destiny[1]}Z`}
                  stroke="black"
                />
              );
            }),
          ];
        }, [])}
      </svg>
      {tree.map((leaf: ILeaf) => {
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
