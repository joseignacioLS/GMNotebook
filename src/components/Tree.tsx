import React, { useContext } from "react";
import styles from "./tree.module.scss";
import { DataContext } from "@/context/data";
import { dataI } from "@/context/constants";
import { getTextReferences } from "@/utils/text";

const generateDataTree = (value: dataI) => {
  const tree: { index: number; key: string; children: number[] }[] =
    Object.keys(value).map((key, index) => {
      return {
        index,
        key,
        children: [],
      };
    });

  Object.keys(value).forEach((key) => {
    const leaf = tree.findIndex((v) => v.key === key);
    const refes = getTextReferences(value[key].text);
    tree[leaf].children = refes.map((v) => {
      return tree.findIndex((k) => k.key === v);
    });
  });
  return tree;
};

const Tree = () => {
  const { data } = useContext(DataContext);
  const tree = generateDataTree(data);

  return <div className={styles.treeContainer}></div>;
};

export default Tree;
