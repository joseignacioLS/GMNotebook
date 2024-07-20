import { IData } from "@/context/constants";
import { ECommands, regex } from "./constants";
import predictor from "./markov/markov";

const getCommandParam = (match: string) => {
  return match.match(/\(([a-z0-9]*)\)/)?.[1];
};

const processCommand = (
  text: string,
  matchPosition: number,
  target: any,
  targetString: string,
  replacementString: string
) => {
  setTimeout(() => {
    target.selectionEnd = matchPosition + replacementString.length;
    target.blur();
    target.focus();
  }, 0);
  return text.replace(targetString, replacementString);
};

const processNameCommand = (
  text: string,
  match: string,
  matchPosition: number,
  target: any
) => {
  const selectedPredictor = predictor.tolkienNames;
  const replacementString = selectedPredictor.trained
    ? selectedPredictor.predict({
      window: 3,
      windowPredict: 1,
      minLength: 4,
      maxLength: 12,
    })
    : "Error";
  return processCommand(text, matchPosition, target, match, replacementString);
};

const processPlaceCommand = (
  text: string,
  match: string,
  matchPosition: number,
  target: any
) => {
  const param = getCommandParam(match);
  const selectedPredictor = predictor.tolkienPlaces;
  const replacementString = selectedPredictor.trained
    ? selectedPredictor.predict({
      window: 3,
      windowPredict: 1,
      minLength: param === "short" ? 3 : 8,
      maxLength: param == "short" ? 10 : 20,
    })
    : "Error";
  return processCommand(text, matchPosition, target, match, replacementString);
};

const processTodayCommand = (
  text: string,
  match: string,
  matchPosition: number,
  target: any
) => {
  const replacementString = new Date().toLocaleDateString();
  return processCommand(text, matchPosition, target, match, replacementString);
};

const processChrCommand = (text: string, match: string, matchPosition: number, target: any, data: IData) => {
  const selectedPredictor = predictor.tolkienNames;
  if (!selectedPredictor.trained) {
    return processCommand(text, matchPosition, target, match, "Error");
  }
  let name = selectedPredictor.predict({
    window: 3,
    windowPredict: 1,
    minLength: 4,
    maxLength: 12,
  })
  while (data?.[name] !== undefined) {
    name = selectedPredictor.predict({
      window: 3,
      windowPredict: 1,
      minLength: 4,
      maxLength: 12,
    })
  }
  const replacementString = `note:${selectedPredictor.predict({
    window: 3,
    windowPredict: 1,
    minLength: 4,
    maxLength: 12,
  })}`
    ;
  return processCommand(text, matchPosition, target, match, replacementString);
}

const commandToFn: { [key in ECommands]: (...args: any) => string } = {
  [ECommands.name]: processNameCommand,
  [ECommands.place]: processPlaceCommand,
  [ECommands.today]: processTodayCommand,
  [ECommands.chr]: processChrCommand
}

export const processCommands = (textArea: HTMLElement, text: string, data: IData) => {
  const match = text.match(regex.command);
  if (!match) return text;
  const matchStr = match[0];
  const command = matchStr.trimEnd().split("(")[0] as ECommands;
  if (!command) return text
  return commandToFn[command]?.(text, matchStr, match.index || 0, textArea, data) || text
};
