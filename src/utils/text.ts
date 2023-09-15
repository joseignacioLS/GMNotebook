
import { generateColor } from "./color";
import { textPieceI } from "@/context/data";

export const getWordCount = (text: string) => {
  return text?.split(" ").length
}

export const getTextReferences = (text: string): string[] => {
  const matches = text.match(/\[[^\]]+\]/g)
  return Array.from(new Set(matches || []));
};


export const splitTextIntoReferences = (
  references: string[],
  text: string
): textPieceI[] => {


  let workText = text.slice()

  const sliceText = (text: string, index0: number, index1: number): string[] => {
    return [text.slice(0, index0), text.slice(index1)]
  }

  const output = []
  try {
    const regex = new RegExp(references.map(v => `\\${v.slice(0, v.length - 1)}\\]`)
      .join("|"))
    const regexSp = new RegExp(["<br>"].map(v => `${v}`).join("|"))
    let index = 0;
    let safe = 100
    while (workText.length > 0 && safe > 0) {
      safe -= 1

      let addText = "";

      const matchReg = references.length > 0 ? workText.match(regex) : undefined
      const matchSp = workText.match(regexSp)

      const regMatch = matchReg?.[0] || ""
      const regIndex = matchReg?.index !== undefined ? matchReg.index : Infinity
      const spMatch = matchSp?.[0] || ""
      const spIndex = matchSp?.index !== undefined ? matchSp.index : Infinity

      if (regIndex !== Infinity || spIndex !== Infinity) {
        if (regIndex < spIndex) {
          [addText, workText] = sliceText(workText, regIndex, regIndex + (regMatch?.length || 0))
          output.push({ content: addText })
          output.push({
            content: regMatch,
            key: regMatch.slice(1, regMatch.length - 1),
            color: generateColor(regMatch),
            visible: true,
            id: regMatch.slice(1, regMatch.length - 1) + "-" + index
          })
          index += 1
        }
        else {
          [addText, workText] = sliceText(workText, spIndex, spIndex + (spMatch?.length || 0))
          output.push({ content: addText })
          output.push({
            content: spMatch
          })

        }
      }
      else {
        output.push({
          content: workText,
        })
        break;
      }
    }
  }
  catch (err) {

  }

  return output;
};