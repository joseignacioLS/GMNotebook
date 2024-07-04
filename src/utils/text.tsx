import { IReference } from "@/context/constants";
import { ReactElement } from "react";
import Reference from "@/components/Page/Reference";
import { checkIfVisible } from "./dom";
import { EMatchKeys, regex, specialMatchesRegex } from "./constans";

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

// const getWordCount = (text: string): number => {
//   return text?.split(" ").length;
// };

const checkForTitle = (line: string) => {
  return line.match(regex.title);
};

const checkForSubtitle = (line: string) => {
  return line.match(regex.subtitle);
};

const formatTitleLine = (line: string, index: number, plain: boolean) => {
  return (
    <p key={line} id={`p-${index}`} className="text-title">
      {processLine(line.slice(2), index, plain, true)}
    </p>
  );
};

const formatSubtitleLine = (line: string, index: number, plain: boolean) => {
  return (
    <p key={line} id={`p-${index}`} className="text-subtitle">
      {processLine(line.slice(3), index, plain, true)}
    </p>
  );
};

// const generateInsertionRegex = (
//   key: string,
//   value: string,
//   flags: string = ""
// ) => {
//   return new RegExp(`${key}\:${value}`, flags);
// };

// const removeReferences = (
//   text: string,
//   references: string[]
// ): string => {
//   references.forEach((refe: string) => {
//     text = text.replace(generateInsertionRegex("note", refe, "g"), refe);
//   });
//   return text;
// };

const generateItemFromMatch = (
  matchKey: string,
  key: string,
  id: string,
  plain: boolean
) => {
  if (matchKey === EMatchKeys.note) {
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
  } else if (matchKey === EMatchKeys.image) {
    return <img key={id} src={key} />;
  }
  return <>{key}</>;
};

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
    {
      key: undefined,
      id: undefined,
      innerHTML: line.slice(prevIndex, prevIndex + (match.index || 0)),
    },
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
    [EMatchKeys.image]: regex.imageInsergion,
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
  // add end of text
  result?.result.push({
    key: undefined,
    id: undefined,
    innerHTML: line.slice(result.index),
  });

  return result.result;
};

const splitLineByInsertions = (
  line: string,
  index: number
): IInsertionObject[] => {
  const specialMatches = line.match(specialMatchesRegex);
  if (!specialMatches) {
    return [{ innerHTML: line, id: undefined, key: undefined }];
  }
  return getArrayOfInsertions(line, specialMatches, index);
};

const formatSplittedLine = (
  lineByInsertions: IInsertionObject[],
  plain: boolean
) => {
  return lineByInsertions.map((item: any) => {
    if (item.id === undefined) return item.innerHTML;
    return generateItemFromMatch(item.innerHTML, item.key, item.id, plain);
  });
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

  const lineByInsertions = splitLineByInsertions(line, index);
  const formatedLine = formatSplittedLine(lineByInsertions, plain);

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
