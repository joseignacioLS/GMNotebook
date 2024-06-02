"use client";

import { DataContext } from "@/context/data";
import { processLine } from "@/utils/text";
import { useContext } from "react";

export const useProcessText = (text: string, plain: boolean) => {
  const { editMode } = useContext(DataContext);
  const lines = text.split("\n");
  return lines
    .filter((l) => {
      return editMode || l[0] !== "*";
    })
    .map((l, i) => {
      const line = l[0] === "*" ? l.slice(1) : l;
      return processLine(line, i, plain);
    });
};
