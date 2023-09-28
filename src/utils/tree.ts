import { dataI, leafI } from "@/context/constants";
import { getTextReferences } from "./text";

export const generateDataTree = (value: dataI): leafI[] => {
  const tree: leafI[] = Object.keys(value)
    //get only leafs to shown
    .filter((key: string) => {
      return value[key].showInTree;
    })
    // generate leaf format
    .map((key: string, index: number) => {
      const n = key.split("").reduce((acc: number, curr: string) => {
        return acc + curr.charCodeAt(0);
      }, 0);
      const x = (n * 321) % 80;
      const y = (n * 581) % 80;
      return {
        index,
        key,
        children: [],
        position: [10 + x, 10 + y],
      };
    });

  // get children of leaft
  Object.keys(value).forEach((key: string) => {
    const leaf = tree.findIndex((v: leafI) => v.key === key);
    if (leaf < 0) return;
    const refes = getTextReferences(value[key].text);
    tree[leaf].children = refes
      .map((v) => {
        return tree.findIndex((k: leafI) => k.key === v);
      })
      .filter((v) => v > -1);
  });
  return tree;
};

export const relaxTree = (tree: leafI[]): leafI[] => {
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
