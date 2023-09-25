import React, { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./tree.module.scss";
import { DataContext } from "@/context/data";
import { dataI } from "@/context/constants";
import { getTextReferences } from "@/utils/text";
import { generateColor } from "@/utils/color";
import { NavigationContext } from "@/context/navigation";
import { modalContext } from "@/context/modal";

interface leafI {
  index: number;
  key: string;
  children: number[];
  position: number[];
}

const generateDataTree = (value: dataI) => {
  const tree: leafI[] = Object.keys(value).map((key, index) => {
    return {
      index,
      key,
      children: [],
      position: [
        Math.floor(10 + Math.random() * 80),
        Math.floor(10 + Math.random() * 80),
      ],
    };
  });

  Object.keys(value).forEach((key) => {
    const leaf = tree.findIndex((v: leafI) => v.key === key);
    const refes = getTextReferences(value[key].text);
    tree[leaf].children = refes.map((v) => {
      return tree.findIndex((k: leafI) => k.key === v);
    });
  });
  return tree;
};

const relax = (tree: leafI[]) => {
  const FORCE_CONSTANT = 0.00001;
  const REPEL_CONSTANT = 2500;
  const ATTRACT_CONSTANT = 5;

  const forces = tree.map(() => [0, 0]);

  tree.forEach((leaf: leafI, index: number) => {
    // attractive force towards center of graph
    const v = [leaf.position[0] - 50, leaf.position[1] - 50];
    const d = Math.max(1, Math.sqrt(v[0] * v[0] + v[1] * v[1]));
    forces[index] = [forces[index][0] - v[0] * d, forces[index][1] - v[1] * d];
    tree.forEach((otherLeaf: leafI, otherIndex: number) => {
      if (leaf.key === otherLeaf.key) return;
      const v = [
        leaf.position[0] - otherLeaf.position[0],
        leaf.position[1] - otherLeaf.position[1],
      ];
      const d = Math.max(1, Math.sqrt(v[0] * v[0] + v[1] * v[1]));
      // repulsive forces
      forces[index] = [
        forces[index][0] + (REPEL_CONSTANT * v[0]) / (d * d),
        forces[index][1] + (REPEL_CONSTANT * v[1]) / (d * d),
      ];
      forces[otherIndex] = [
        forces[otherIndex][0] - (REPEL_CONSTANT * v[0]) / (d * d),
        forces[otherIndex][1] - (REPEL_CONSTANT * v[1]) / (d * d),
      ];

      // attractive forces
      if (leaf.children.includes(otherIndex)) {
        forces[index] = [
          forces[index][0] - ATTRACT_CONSTANT * v[0] * d,
          forces[index][1] - ATTRACT_CONSTANT * v[1] * d,
        ];
        forces[otherIndex] = [
          forces[otherIndex][0] + ATTRACT_CONSTANT * v[0] * d,
          forces[otherIndex][1] + ATTRACT_CONSTANT * v[1] * d,
        ];
      }
    });
  });

  return tree.map((leaf: leafI, index: number) => {
    // capping forces to eliminate small movements
    const fX: number =
      Math.abs(forces[index][0]) - 0 > 1 ? forces[index][0] : 0;
    const fY: number =
      Math.abs(forces[index][1]) - 0 > 1 ? forces[index][1] : 0;
    leaf.position = [
      leaf.position[0] + FORCE_CONSTANT * fX,
      leaf.position[1] + FORCE_CONSTANT * fY,
    ];
    // limiting graph to the svg area
    if (leaf.position[0] < 0) leaf.position[0] = 0;
    if (leaf.position[1] < 0) leaf.position[1] = 0;
    if (leaf.position[0] > 100) leaf.position[0] = 100;
    if (leaf.position[1] > 100) leaf.position[1] = 100;
    return leaf;
  });
};

const Tree = () => {
  const { data } = useContext(DataContext);
  const { navigateTo } = useContext(NavigationContext);
  const { closeModal } = useContext(modalContext);
  const [tree, setTree] = useState<leafI[]>(generateDataTree(data));

  const relaxTreeMore = () => {
    setTree((oldValue) => relax(oldValue));
  };

  useEffect(() => {
    let relaxedTree = tree;
    for (let i = 0; i < 5000; i++) {
      relaxedTree = relax(relaxedTree);
    }
    setTree(relaxedTree);
    const interval = setInterval(relaxTreeMore, 5);
    return () => clearInterval(interval);
  }, []);

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
              navigateTo(leaf.key);
            }}
          >
            {data[leaf.key].title}
          </span>
        );
      })}
    </div>
  );
};

export default Tree;
