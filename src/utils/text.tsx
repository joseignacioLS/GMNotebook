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

interface IInsertionObject {
  innerHTML: string;
  key?: string;
  id?: string;
}

const specialMatchesRegex = new RegExp("(note:|img:)", "g");

export const getWordCount = (text: string): number => {
  return text?.split(" ").length;
};

export const checkForTitle = (line: string) => {
  return line.match(/^\# /);
};

export const checkForSubtitle = (line: string) => {
  return line.match(/^\#\# /);
};

export const formatTitleLine = (
  line: string,
  index: number,
  plain: boolean
) => {
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
  matchKey: string,
  key: string,
  id: string,
  plain: boolean
) => {
  if (matchKey === "note:") {
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
  } else if (matchKey === "img:") {
    return <img key={id} src={key} />;
  }
  return <>{key}</>;
};

const generateInsertionObject = (
  line: string,
  match: RegExpMatchArray,
  matchKey: string,
  index: number,
  prevIndex: number,
  iterationIndex: number
): IInsertionObject[] => {
  const key = match[0].split(matchKey)[1];
  const id = key + "_" + index + "_" + iterationIndex;
  const inBetweenText = line.slice(prevIndex, prevIndex + (match.index || 0));
  return [
    { key: undefined, id: undefined, innerHTML: inBetweenText },
    { key, id, innerHTML: matchKey },
  ];
};

const getFullInsertionMatch = (
  matchKey: string,
  line: string,
  index: number
): RegExpMatchArray | null => {
  const regexRef: { [key: string]: string } = {
    "note:": "note:[A-Záéíóúüïñ0-9]+",
    "img:": "img:[^\n ]+",
  };
  const regex = new RegExp(`${regexRef[matchKey]}`, "i");
  const match = line.slice(index).match(regex);
  return match;
};

const getArrayOfInsertions = (
  line: string,
  arrayOfMatches: any,
  index: number
): IInsertionObject[] => {
  const result = arrayOfMatches?.reduce(
    (
      acc: { result: IInsertionObject[]; index: number },
      matchKey: string,
      iterationIndex: number
    ) => {
      if (!matchKey) {
        return acc;
      }
      const match = getFullInsertionMatch(matchKey, line, acc.index);
      if (!match || match.index === undefined) {
        return acc;
      }
      const insertionObjects = generateInsertionObject(
        line,
        match,
        matchKey,
        index,
        acc.index,
        iterationIndex
      );

      const nextIndex = acc.index + match.index + match[0].length;
      return {
        result: [...acc.result, ...insertionObjects],
        index: nextIndex,
      };
    },
    {
      result: [],
      index: 0,
    }
  );

  result?.result.push({
    key: undefined,
    id: undefined,
    innerHTML: line.slice(result.index),
  });

  return result.result;
};

export const findTextInsertions = (
  line: string,
  index: number
): IInsertionObject[] => {
  const specialMatches = line.match(specialMatchesRegex);
  if (!specialMatches) {
    return [{ innerHTML: line, id: undefined, key: undefined }];
  }
  return getArrayOfInsertions(line, specialMatches, index);
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

  const textInsertions = findTextInsertions(line, index);
  const formatedLine = textInsertions.map((item: any) => {
    if (item.id === undefined) return item.innerHTML;
    return generateItemFromMatch(item.innerHTML, item.key, item.id, plain);
  });

  return wrapped ? (
    <span key={line + index}>{formatedLine}</span>
  ) : (
    <p key={line + index} id={`p-${index}`}>
      {formatedLine}
    </p>
  );
};

export const extractReferences = (text: string): string[] => {
  const lines = text.split("\n");
  return lines.reduce((acc: string[], line: string, index: number) => {
    return [...acc, ...exportLineReferences(line, index)] as string[];
  }, []);
};

const exportLineReferences = (line: string, index: number): string[] => {
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
