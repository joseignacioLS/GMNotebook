import { referenceI } from "@/api/data";
import { generateColor } from "./color";
import { dataI } from "@/context/data";

export const getWordCount = (text: string) => {
  return text.split(" ").length
}

export const getTextReferences = (text: string): string[] | null => {
  return text.match(/\[[^\]]+\]/g);
};


export const includeRerencesInText = (text: string, data: dataI, excludeRefs: string[] = []) => {
  Object.keys(data).forEach((key: string) => {
    if (excludeRefs.includes(key)) return;
    const regex = new RegExp(`(^|[ ])(${key})([ \.,\-])`, "g");
    text = text.replace(regex, `$1[$2]$3`);
  });
  return text;
};

export const replaceReferencesByDisplay = (text: string, data: dataI) => {
  text = includeRerencesInText(text, data, [])
  Object.keys(data).forEach((key: string) => {
    text = text.replace(new RegExp(`\\[${key}\\]`), data[key].display)
  })
  return text
}

export const splitTextIntoReferences = (
  references: string[],
  text: string,
  data: dataI
): referenceI[] => {
  let trimIndex = 0;
  const splittedText = references
    .map((ref: string, i: number) => {
      const cleanUp = ref.replace(/[\[\]]/g, "");
      if (!data[cleanUp])
        return {
          key: "",
          index: 0,
          id: "",
          data: { title: "", key: "", display: "", text: "" },
          visible: false,
          color: "",
        };
      const regex = new RegExp("\\[" + cleanUp + "\\]");
      const match = text.slice(trimIndex).match(regex);
      const findIndex = match?.index || 0;
      const positionIndex = trimIndex + findIndex;
      trimIndex += findIndex + cleanUp.length + 2;
      return {
        key: cleanUp,
        index: positionIndex,
        id: `${cleanUp}-${i}`,
        data: data[cleanUp],
        visible: false,
        color: generateColor(cleanUp),
      };
    })
    .filter((v: referenceI) => {
      return v.key !== "";
    });
  return splittedText;
};