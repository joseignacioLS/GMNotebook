import React, { useContext } from "react";
import styles from "./reference.module.scss";
import { referenceI } from "@/context/constants";
import { DataContext } from "@/context/data";
import { generateColor } from "@/utils/color";
import { useRouter } from "next/router";

interface propsI {
  reference: referenceI;
  naked?: boolean;
}

const Reference = ({ reference, naked = false }: propsI) => {
  const { selectedNote, updateSelectedNote, data, gmMode, gameName, editMode } =
    useContext(DataContext);
  const router = useRouter();
  const color = generateColor(reference.key);
  return (
    <span
      className={`${styles.reference} reference${reference.id}`}
      style={{
        backgroundColor: naked
          ? "rgba(0,0,0,.5)"
          : `color-mix(in srgb, ${color} 40%, ${
              selectedNote === reference.key ? "#ff0000ff" : color
            }`,
      }}
      onMouseOver={() => {
        if (naked) return;
        updateSelectedNote(reference.key || "");
      }}
      onMouseLeave={() => {
        if (!editMode) {
          updateSelectedNote("");
        }
      }}
      onClick={() => {
        if (data[reference.key].showToPlayers || gmMode) {
          updateSelectedNote(reference.key || "");
          router.push(`/${gameName}/${reference.key}`);
        }
      }}
    >
      {data[reference.key]?.display}
    </span>
  );
};

export default Reference;
