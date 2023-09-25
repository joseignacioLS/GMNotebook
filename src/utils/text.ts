import { textPieceI } from "@/context/constants";
import { generateColor } from "./color";
import { imageRegex } from "./constans";

export const getWordCount = (text: string) => {
  return text?.split(" ").length;
};

export const getTextReferences = (text: string): string[] => {
  const matches = text.match(/note\:[a-z0-9]+/gi)?.map((v) => {
    return v.split(":")[1];
  });
  return Array.from(new Set(matches || []));
};

export const splitTextIntoReferences = (text: string): textPieceI[] => {
  let workText = text.slice();

  const sliceText = (
    text: string,
    index0: number = 0,
    index1: number | undefined = undefined
  ): string[] => {
    return [text.slice(0, index0), text.slice(index1)];
  };

  const output = [];
  const regex = new RegExp(`note:[A-Za-z0-9]+(?:[^A-Za-z0-9]|$)`);
  const regexBreak = /\n/;
  try {
    let safe = 1000;
    while (workText.length > 0 && safe > 0) {
      safe -= 1;

      let addText = "";

      const matchReg = workText.match(regex);
      const matchBreak = workText.match(regexBreak);
      const matchImg = workText.match(imageRegex);

      const regMatch = matchReg?.[0] || "";
      const regIndex =
        matchReg?.index !== undefined ? matchReg.index : Infinity;
      const breakMatch = matchBreak?.[0] || "";
      const breakIndex =
        matchBreak?.index !== undefined ? matchBreak.index : Infinity;
      const imgMatch = matchImg?.[0] || "";
      const imgIndex =
        matchImg?.index !== undefined ? matchImg.index : Infinity;

      const first = [
        {
          match: regMatch,
          index: regIndex,
          type: "reference",
        },
        {
          match: breakMatch,
          index: breakIndex,
          type: "break",
        },
        {
          match: imgMatch,
          index: imgIndex,
          type: "image",
        },
      ].sort((a: any, b: any) => {
        return a.index > b.index ? 1 : -1;
      })[0];
      if (first.index === Infinity) {
        output.push({
          type: "text",
          content: workText,
        });
        break;
      }
      if (first.type === "reference") {
        const match = first.match.split(":")[1].match(/[a-z0-9]+/i);
        if (!match) continue;
        const key = match[0] as string;
        [addText, workText] = sliceText(
          workText,
          first.index,
          first.index + key.length + 5
        );
        output.push({ type: "text", content: addText });
        output.push({
          type: "reference",
          content: first.match,
          key: key,
          color: generateColor(key),
          visible: true,
          id: key,
        });
      } else if (first.type === "break") {
        [addText, workText] = sliceText(
          workText,
          first.index,
          first.index + (first.match.length || 0)
        );
        output.push({ type: "text", content: addText });
        output.push({
          type: "break",
          content: first.match,
        });
      } else if (first.type === "image") {
        [addText, workText] = sliceText(
          workText,
          first.index,
          first.index + (first.match.length || 0)
        );
        output.push({ type: "text", content: addText });
        output.push({
          type: "image",
          content: first.match,
        });
      }
    }
  } catch (err) {}
  return output;
};
