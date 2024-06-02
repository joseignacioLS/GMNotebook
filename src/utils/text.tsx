import { IReference } from "@/context/constants";
import { ReactElement } from "react";
import Reference from "@/components/Page/Reference";

export interface ILineProcess {
  result: (string | ReactElement)[];
  index: number;
}

interface ILineProcessReference {
  result: string[];
  index: number;
}

const specialMatchesRegex = new RegExp("(note:|img:)", "g");

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

const findTextInsertions = (line: string, index: number, plain: boolean) => {
  const regexRef: { [key: string]: string } = {
    "note:": "note:[A-Záéíóúüïñ0-9]+",
    "img:": "img:[^\n ]+",
  };
  const specialMatches = line.match(specialMatchesRegex);
  return specialMatches?.reduce(
    (acc: ILineProcess, curr, i) => {
      if (regexRef[curr]) {
        const regex = new RegExp(`${regexRef[curr]}`, "i");
        const match = line.slice(acc.index).match(regex);
        if (!match || match.index === undefined) {
          return acc;
        }
        const key = match[0].split(curr)[1];
        const id = key + "_" + index + "_" + i;
        const nextIndex = acc.index + match.index + match[0].length;
        if (curr === "note:") {
          return {
            result: [
              ...acc.result,
              line.slice(acc.index, acc.index + match.index),
              <Reference
                key={id}
                reference={
                  {
                    id,
                    visible: true,
                    key,
                  } as IReference
                }
                naked={plain}
              ></Reference>,
            ],
            index: nextIndex,
          } as ILineProcess;
        }
        if (curr === "img:") {
          return {
            result: [
              ...acc.result,
              line.slice(acc.index, acc.index + match.index),
              <img key={id} src={key} />,
            ],
            index: nextIndex,
          } as ILineProcess;
        }
      }
      return acc;
    },
    {
      result: [],
      index: 0,
    } as ILineProcess
  );
};

export const processLine = (
  line: string,
  index: number,
  plain: boolean,
  wrapped: boolean = false
) => {
  const isTitle = line.match(/^\# /);
  const isSubtitle = line.match(/^\#\# /);
  if (isTitle) {
    return (
      <p key={line} id={`p-${index}`} className="text-title">
        {processLine(line.slice(1), index, plain, true)}
      </p>
    );
  }
  if (isSubtitle) {
    return (
      <p key={line} id={`p-${index}`} className="text-subtitle">
        {processLine(line.slice(2), index, plain, true)}
      </p>
    );
  }

  const result = findTextInsertions(line, index, plain);
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

const exportLineReferences = (line: string, index: number) => {
  const specialMatches = line.match(/(note:|img:)/g);
  const result: ILineProcessReference | undefined = specialMatches?.reduce(
    (acc: ILineProcessReference, curr, i) => {
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
        } as ILineProcessReference;
      }
      return acc;
    },
    {
      result: [],
      index: 0,
    } as ILineProcessReference
  );
  return result?.result || [];
};
