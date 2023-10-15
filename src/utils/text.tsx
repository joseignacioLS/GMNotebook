import { referenceI } from "@/context/constants";
import { ReactElement } from "react";
import Reference from "@/components/Page/Reference";

export const getWordCount = (text: string) => {
  return text?.split(" ").length;
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

interface lineProcessI {
  result: (string | ReactElement)[];
  index: number;
}

export const processText = (
  text: string,
  plain: boolean = false,
  gmMode: boolean = true
) => {
  const lines = text.split("\n");
  return lines
    .filter((l) => {
      return gmMode || l[0] !== "*";
    })
    .map((l, i) => {
      const line = l[0] === "*" ? l.slice(1) : l;
      return processLine(line, i, plain);
    });
};

export const processLine = (
  line: string,
  index: number,
  plain: boolean,
  wrapped: boolean = false
) => {
  if (line.match(/^\# /)) {
    return (
      <p key={line} id={`p-${index}`} className="text-title">
        {processLine(line.slice(1), index, plain, true)}
      </p>
    );
  } else if (line.match(/^\#\# /)) {
    return (
      <p key={line} id={`p-${index}`} className="text-subtitle">
        {processLine(line.slice(2), index, plain, true)}
      </p>
    );
  }
  const specialMatches = line.match(/(note:|img:)/g);
  const result: lineProcessI | undefined = specialMatches?.reduce(
    (acc: lineProcessI, curr, i) => {
      if (curr.includes("note:")) {
        const regex = new RegExp(`${curr}[A-Záéíóúüïñ0-9]+`, "i");
        const match = line.slice(acc.index).match(regex);
        if (!match || match.index === undefined) {
          return acc;
        }
        const key = match[0].split("note:")[1];
        const item = (
          <Reference
            key={key + "_" + index + "_" + i}
            reference={
              {
                id: key + "_" + index + "_" + i,
                visible: true,
                key: key,
              } as referenceI
            }
            naked={plain}
          ></Reference>
        );
        return {
          result: [
            ...acc.result,
            line.slice(acc.index, acc.index + match.index),
            item,
          ],
          index: acc.index + match.index + match[0].length,
        } as lineProcessI;
      }
      if (curr.includes("img:")) {
        const regex = new RegExp(`${curr}[^\n ]+`);
        const match = line.slice(acc.index).match(regex);
        if (!match || match.index === undefined) {
          return acc;
        }
        const key = match[0].split("img:")[1];
        const item = <img key={key + "_" + index + "_" + i} src={key} />;
        return {
          result: [
            ...acc.result,
            line.slice(acc.index, acc.index + match.index),
            item,
          ],
          index: acc.index + match.index + match[0].length,
        } as lineProcessI;
      }
      return acc;
    },
    {
      result: [],
      index: 0,
    } as lineProcessI
  );
  if (result) {
    result.result.push(line.slice(result.index));
    return wrapped ? (
      <span key={line + index}>{result.result}</span>
    ) : (
      <p id={`p-${index}`} key={line + index}>
        {result.result}
      </p>
    );
  }
  return wrapped ? (
    <span key={line + index}>{line}</span>
  ) : (
    <p id={`p-${index}`} key={line + index}>
      {line}
    </p>
  );
};

export const extractReferences = (text: string): string[] => {
  const lines = text.split("\n");
  return lines.reduce((acc: string[], l: string, i: number) => {
    return [...acc, ...exportLineReferences(l, i)] as string[];
  }, []);
};

interface lineProcessReferenceI {
  result: string[];
  index: number;
}

const exportLineReferences = (line: string, index: number) => {
  const specialMatches = line.match(/(note:|img:)/g);
  const result: lineProcessReferenceI | undefined = specialMatches?.reduce(
    (acc: lineProcessReferenceI, curr, i) => {
      const regex = new RegExp(`${curr}[A-Záéíóúüïñ0-9]+`, "i");
      const match = line.slice(acc.index).match(regex);
      if (!match || match.index === undefined) {
        return acc;
      }
      const key = match[0].split(":")[1];
      if (match[0].includes("note:")) {
        return {
          result: [...acc.result, `${key}_${index}_${i}`],
          index: acc.index + match.index + match[0].length,
        } as lineProcessReferenceI;
      }
      return acc;
    },
    {
      result: [],
      index: 0,
    } as lineProcessReferenceI
  );
  return result?.result || [];
};
