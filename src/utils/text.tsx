import { ReactElement } from "react";
import { IInsertionObject, checkIfVisible, processLine } from "./dom";
import { ECommands, EMatchKeys, regex } from "./constants";
import predictor from "./markov/markov";

export interface ILineProcess {
  result: (string | ReactElement)[];
  index: number;
}

interface ILineProcessReference {
  result: string[];
  index: number;
}

const generateInsertionId = (
  key: string,
  index: number,
  iterationIndex: number
) => {
  return `${key}_${index}_${iterationIndex}`;
};

const generateInsertionObject = (
  line: string,
  match: RegExpMatchArray,
  matchKey: string,
  index: number,
  prevIndex: number,
  iterationIndex: number
): IInsertionObject[] => {
  const [, key] = match[0].split(matchKey);
  return [
    // text between previous match and current
    {
      key: undefined,
      id: undefined,
      innerHTML: line.slice(prevIndex, prevIndex + (match.index || 0)),
    },
    // insertion
    {
      key,
      id: generateInsertionId(key, index, iterationIndex),
      innerHTML: matchKey,
    },
  ];
};

const getFullInsertionMatch = (
  matchKey: string,
  line: string,
  index: number
): RegExpMatchArray | null => {
  const regexRef: { [key in EMatchKeys]: RegExp } = {
    [EMatchKeys.note]: regex.noteInsertion,
    [EMatchKeys.image]: regex.imageInsertion,
    [EMatchKeys.link]: regex.linkInsertion,
  };
  const selectedRegex = new RegExp(regexRef[matchKey as EMatchKeys], "i");
  const match = line.slice(index).match(selectedRegex);
  return match;
};

const getArrayOfInsertions = (
  line: string,
  arrayOfMatches: RegExpMatchArray,
  index: number
): IInsertionObject[] => {
  const result = arrayOfMatches?.reduce(
    (
      insertions: { result: IInsertionObject[]; index: number },
      matchKey: string,
      iterationIndex: number
    ) => {
      if (!matchKey) {
        return insertions;
      }
      const match = getFullInsertionMatch(matchKey, line, insertions.index);
      if (!match || match.index === undefined) {
        return insertions;
      }
      const insertionObjects = generateInsertionObject(
        line,
        match,
        matchKey,
        index,
        insertions.index,
        iterationIndex
      );

      return {
        result: [...insertions.result, ...insertionObjects],
        index: insertions.index + match.index + match[0].length,
      };
    },
    {
      result: [],
      index: 0,
    }
  );
  // add end of text after last insertion
  result?.result.push({
    key: undefined,
    id: undefined,
    innerHTML: line.slice(result.index),
  });

  return result.result;
};

export const splitLineByInsertions = (
  line: string,
  index: number
): IInsertionObject[] => {
  const specialMatches = line.match(regex.insertions);
  if (!specialMatches) {
    return [{ innerHTML: line, id: undefined, key: undefined }];
  }
  return getArrayOfInsertions(line, specialMatches, index);
};

const formatMermaidBlocks = (text: string): string => {
  text.match(new RegExp(regex.mermaid, "g"))?.forEach((match) => {
    text = text.replace(match, `\n${match.replace(/(.{1})\n/g, "$1;")}`);
  });
  return text;
};

export const extractReferences = (text: string): string[] => {
  text = formatMermaidBlocks(text);
  const lines = text.split("\n");
  return lines.reduce((references: string[], line: string, index: number) => {
    const specialMatches = line.match(regex.insertions);
    if (!specialMatches) {
      return references;
    }
    return [
      ...references,
      ...exportLineReferences(line, specialMatches, index),
    ] as string[];
  }, []);
};

const exportLineReferences = (
  line: string,
  arrayOfMatches: RegExpMatchArray,
  index: number
): string[] => {
  const result: ILineProcessReference = arrayOfMatches.reduce(
    (
      references: ILineProcessReference,
      matchKey: string,
      iterationIndex: number
    ) => {
      if (!matchKey) {
        return references;
      }
      const match = getFullInsertionMatch(matchKey, line, references.index);
      if (!match || match.index === undefined) {
        return references;
      }
      const [, key] = match[0].split(":");
      if (match[0].includes(EMatchKeys.note)) {
        return {
          result: [
            ...references.result,
            generateInsertionId(key, index, iterationIndex),
          ],
          index: references.index + match.index + match[0].length,
        } as ILineProcessReference;
      }
      return references;
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
    .reduce((lengths: number[], length: number) => {
      if (lengths.length === 0) return [length];
      return [...lengths, length + 1 + lengths[lengths.length - 1]];
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

export const filterReferencesBasedOnVisibility = (text: string) => {
  const extractedReferences = extractReferences(text);
  return extractedReferences.reduce((references: string[], key: string) => {
    const visible = checkIfVisible(key);
    if (!visible) return references;
    const [searchKey] = key.split("_");
    const alreadyVisible = references.some((reference: string) => {
      return searchKey === reference.split("_")[0];
    });
    if (alreadyVisible) return references;
    return [...references, key] as string[];
  }, [] as string[]);
};

export const processText = (text: string, plain: boolean) => {
  // extract blocks
  text = formatMermaidBlocks(text);
  //process lines
  return text.split("\n").map((line, i) => {
    return processLine(line, i, plain);
  });
};

export const stringToNumber = (input: string): number => {
  return input.split("").reduce((acc: number, curr: string, i: number) => {
    return acc * (curr.charCodeAt(0) / (i + 1));
  }, 1);
};
