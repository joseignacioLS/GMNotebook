import { dataI, referenceI, textPieceI } from "@/context/constants";
import { generateColor } from "./color";
import { imageRegex, subtitleRegex, titleRegex } from "./constans";
import { ReactElement } from "react";
import Reference from "@/components/Page/Reference";

export const getWordCount = (text: string) => {
  return text?.split(" ").length;
};

export const getTextReferences = (text: string): string[] => {
  const matches = text.match(/note\:[a-z0-9]+/gi)?.map((v) => {
    return v.split(":")[1];
  });
  return Array.from(new Set(matches || []));
};

export const removeReferences = (
  text: string,
  references: string[]
): string => {
  references.forEach((refe: string) => {
    text = text.replace(new RegExp(`note\:${refe}`, "g"), refe);
  });
  return text;
};

export const splitTextIntoReferences = (text: string): textPieceI[] => {
  let workText = text.slice();

  const sliceText = (
    text: string,
    index0: number,
    index1: number
  ): string[] => {
    return [text.slice(0, index0), text.slice(index1)];
  };

  const output = [];
  const regex = new RegExp(`(note:[A-Za-z0-9]+)(?:[^A-Za-z0-9]|$)`);
  const regexBreak = /\n/;
  try {
    let safe = 1000;
    while (workText.length > 0 && safe > 0) {
      safe -= 1;

      let addText = "";

      const matchReg = workText.match(regex);
      const matchBreak = workText.match(regexBreak);
      const matchImg = workText.match(imageRegex);
      const matchTitle = workText.match(titleRegex);
      const matchSubtitle = workText.match(subtitleRegex);

      const regMatch = matchReg?.[1] || "";
      const regIndex =
        matchReg?.index !== undefined ? matchReg.index : Infinity;
      const breakMatch = matchBreak?.[0] || "";
      const breakIndex =
        matchBreak?.index !== undefined ? matchBreak.index : Infinity;
      const imgMatch = matchImg?.[0] || "";
      const imgIndex =
        matchImg?.index !== undefined ? matchImg.index : Infinity;
      const titleMatch = matchTitle?.[0] || "";
      const titleIndex =
        matchTitle?.index !== undefined ? matchTitle.index : Infinity;
      const subtitleMatch = matchSubtitle?.[0] || "";
      const subtitleIndex =
        matchSubtitle?.index !== undefined ? matchSubtitle.index : Infinity;

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
        {
          match: titleMatch,
          index: titleIndex,
          type: "title",
        },
        {
          match: subtitleMatch,
          index: subtitleIndex,
          type: "subtitle",
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
        if (addText !== "") output.push({ type: "text", content: addText });
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
        if (addText !== "") output.push({ type: "text", content: addText });
        output.push({
          type: "break",
          content: "break",
        });
      } else if (first.type === "image") {
        [addText, workText] = sliceText(
          workText,
          first.index,
          first.index + (first.match.length || 0)
        );
        if (addText !== "") output.push({ type: "text", content: addText });
        output.push({
          type: "image",
          content: first.match,
        });
      } else if (first.type === "title") {
        [addText, workText] = sliceText(
          workText,
          first.index,
          first.index + (first.match.length || 0)
        );
        if (addText !== "") output.push({ type: "text", content: addText });
        output.push({
          type: "title",
          content: first.match,
        });
      } else if (first.type === "subtitle") {
        [addText, workText] = sliceText(
          workText,
          first.index,
          first.index + (first.match.length || 0)
        );
        if (addText !== "") output.push({ type: "text", content: addText });
        output.push({
          type: "subtitle",
          content: first.match,
        });
      }
    }
  } catch (err) {}
  return output;
};

export const proccessTextPieces = (
  text: textPieceI[],
  nakedRef: boolean,
  data: dataI
): ReactElement[] => {
  const acceptedTypes = [
    "reference",
    "text",
    "break",
    "title",
    "subtitle",
    "image",
  ];
  const chuncks: ReactElement[] = text
    .filter((ele) => acceptedTypes.includes(ele.type) && ele.content !== "")
    .map((ele, i) => {
      if (ele.type === "reference") {
        const reference: referenceI = ele as referenceI;
        const content: string = data[reference.key]?.display || "";
        return (
          <Reference key={content} reference={reference} naked={nakedRef}>
            {content}
          </Reference>
        );
      } else if (ele.type === "break") {
        return <br key={`br-${i}`} />;
      } else if (ele.type === "title") {
        const content: string = ele.content.split("title:")[1];
        return (
          <span key={content} className="text-title">
            {content}
          </span>
        );
      } else if (ele.type === "subtitle") {
        const content: string = ele.content.split("subtitle:")[1];
        return (
          <span key={content} className="text-subtitle">
            {content}
          </span>
        );
      } else if (ele.type === "image") {
        const url: string = ele.content.split("img:")[1];
        return <img key={url} src={url} />;
      }
      return <span key={`text-${i}`}>{ele.content}</span>;
    });
  return chuncks;
};

export const generateDisplayText = (
  text: textPieceI[],
  nakedRefs: boolean,
  data: dataI
): ReactElement[] => {
  const ps = [
    -1,
    ...text
      .map((v, i) => (v.type === "break" ? i : undefined))
      .filter((v) => v !== undefined),
    text.length,
  ];
  const output = [];
  for (let i = 0; i < ps.length - 1; i++) {
    const start = (ps[i] || -1) + 1;
    const end = ps[i + 1];
    const content = proccessTextPieces(text.slice(start, end), nakedRefs, data);
    output.push(<p key={`p-${i}`}>{content}</p>);
  }
  return output;
};
