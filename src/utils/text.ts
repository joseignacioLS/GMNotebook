import { generateColor } from "./color";
import { dataI, textPieceI } from "@/context/data";

export const getWordCount = (text: string) => {
  return text?.split(" ").length
}

export const getTextReferences = (text: string): string[] | null => {
  const matches = text.match(/\[[^\]]+\]/g)
  return Array.from(new Set(matches || []));
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
    text = text.replace(new RegExp(`\\[${key}\\]`, "g"), data[key].display)
  })
  return text
}

export const splitTextIntoReferences = (
  references: string[],
  text: string
): textPieceI[] => {


  let workText = text.slice()



  const regex = new RegExp(references.map(v => `\\${v.slice(0, v.length - 1)}\\]`)
    .join("|"))
  const regexSp = new RegExp(["\\n"].join("|"))
  let index = 0;
  const output = []
  while (workText.length > 0) {
    const matchReg = workText.match(regex)
    const matchSp = workText.match(regexSp)
    if (matchReg?.index === undefined && matchSp?.index === undefined) {
      output.push({
        content: workText,
      })
      break;
    }

    if (matchSp?.index !== undefined && matchReg?.index === undefined) {
      output.push({ content: workText.slice(0, matchSp.index) })
      output.push({
        content: matchSp["0"]
      })
      workText = workText.slice(matchSp.index + matchSp["0"].length);
    }
    else if (matchReg?.index !== undefined && matchSp?.index === undefined) {
      output.push({ content: workText.slice(0, matchReg.index) })
      output.push({
        content: matchReg["0"],
        key: matchReg[0].slice(1, matchReg[0].length - 1),
        color: generateColor(matchReg[0]),
        visible: true,
        id: matchReg[0].slice(1, matchReg[0].length - 1) + "-" + index
      })
      workText = workText.slice(matchReg.index + matchReg["0"].length);
      index += 1
    }
    else {
      if (matchReg?.index < matchSp?.index) {
        output.push({ content: workText.slice(0, matchReg.index) })
        output.push({
          content: matchReg["0"],
          key: matchReg[0].slice(1, matchReg[0].length - 1),
          color: generateColor(matchReg[0]),
          visible: true,
          id: matchReg[0].slice(1, matchReg[0].length - 1) + "-" + index
        })
        workText = workText.slice(matchReg.index + matchReg["0"].length);
        index += 1
      }
      else {
        output.push({ content: workText.slice(0, matchSp.index) })
        output.push({
          content: matchSp["0"]
        })
        workText = workText.slice(matchSp.index + matchSp["0"].length);
      }
    }
  }
  return output;
};