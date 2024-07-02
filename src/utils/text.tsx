import { IReference } from "@/context/constants";
import { ReactElement } from "react";
import Reference from "@/components/Page/Reference";
import { checkIfVisible } from "./dom";

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

const checkForTitle = (line: string) => {
  return line.match(/^\# /);
};

const checkForSubtitle = (line: string) => {
  return line.match(/^\#\# /);
};

const formatTitleLine = (line: string, index: number, plain: boolean) => {
  return (
    <p key={line} id={`p-${index}`} className="text-title">
      {processLine(line.slice(1), index, plain, true)}
    </p>
  );
};

const formatSubtitleLine = (line: string, index: number, plain: boolean) => {
  return (
    <p key={line} id={`p-${index}`} className="text-subtitle">
      {processLine(line.slice(2), index, plain, true)}
    </p>
  );
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

const generateItemFromMatch = (
  match: string,
  key: string,
  id: string,
  plain: boolean
) => {
  if (match === "note:") {
    return (
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
      ></Reference>
    );
  } else if (match === "img:") {
    return <img key={id} src={key} />;
  }
  return <>{key}</>;
};

const findTextInsertions = (line: string, index: number, plain: boolean) => {
  const regexRef: { [key: string]: string } = {
    "note:": "note:[A-Záéíóúüïñ0-9]+",
    "img:": "img:[^\n ]+",
  };
  const specialMatches = line.match(specialMatchesRegex);
  if (!specialMatches) {
    return { result: [line], index: 0 } as ILineProcess;
  }
  const textInsertions = specialMatches?.reduce(
    (acc: ILineProcess, curr, i) => {
      if (curr) {
        const regex = new RegExp(`${regexRef[curr]}`, "i");
        const match = line.slice(acc.index).match(regex);
        if (!match || match.index === undefined) {
          return acc;
        }
        const key = match[0].split(curr)[1];
        const id = key + "_" + index + "_" + i;
        const nextIndex = acc.index + match.index + match[0].length;
        const inBetweenText = line.slice(acc.index, acc.index + match.index);
        const item = generateItemFromMatch(curr, key, id, plain);

        return {
          result: [...acc.result, inBetweenText, item],
          index: nextIndex,
        };
      }
      return acc;
    },
    {
      result: [],
      index: 0,
    } as ILineProcess
  );

  // add line ending
  textInsertions?.result.push(line.slice(textInsertions.index));

  return textInsertions;
};

export const processLine = (
  line: string,
  index: number,
  plain: boolean,
  wrapped: boolean = false
) => {
  if (checkForTitle(line)) {
    return formatTitleLine(line, index, plain);
  }
  if (checkForSubtitle(line)) {
    return formatSubtitleLine(line, index, plain);
  }

  const textInsertions = findTextInsertions(line, index, plain);

  return wrapped ? (
    <span key={line + index}>{textInsertions.result}</span>
  ) : (
    <p key={line + index} id={`p-${index}`}>
      {textInsertions.result}
    </p>
  );
};

export const extractReferences = (text: string): string[] => {
  const lines = text.split("\n");
  return lines.reduce((acc: string[], line: string, index: number) => {
    return [...acc, ...exportLineReferences(line, index)] as string[];
  }, []);
};

const exportLineReferences = (line: string, index: number) => {
  const specialMatches = line.match(/(note:|img:)/g);
  if (!specialMatches) {
    return [];
  }
  const result: ILineProcessReference = specialMatches.reduce(
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
  return result?.result;
};

// paragraphs

const getParagraphLength = (text: string): number[] => {
  return text
    .split("\n")
    .map((v: string) => v.length)
    .reduce((acc: number[], curr: number) => {
      if (acc.length === 0) return [curr];
      return [...acc, curr + 1 + acc[acc.length - 1]];
    }, []);
};

export const getSelectedParagraphIndex = (
  cursorPosition: number,
  text: string
): number => {
  const paragraphLength = getParagraphLength(text);
  let pIndex = 0;
  for (let i = 1; i < paragraphLength.length; i++) {
    if (
      paragraphLength[i - 1] < cursorPosition &&
      paragraphLength[i] >= cursorPosition
    ) {
      pIndex = i;
    }
  }
  return pIndex;
};

export const filterReferences = (text: string) => {
  const extractedReferences = extractReferences(text);
  return extractedReferences.reduce((acc: string[], key: string) => {
    const visible = checkIfVisible(key);
    if (!visible) return acc;
    const searchKey = key.split("_")[0];
    const alreadyThere = acc.some((reference: string) => {
      return searchKey === reference.split("_")[0];
    });
    if (alreadyThere) return acc;
    return [...acc, key] as string[];
  }, [] as string[]);
};
