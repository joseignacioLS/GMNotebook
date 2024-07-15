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

export const processCommands = (textArea: HTMLElement, text: string) => {
  const commandMatch = text.match(regex.command);
  if (!commandMatch) return text;
  const match = commandMatch[0];
  if (match.includes(ECommands.name)) {
    return processNameCommand(text, match, commandMatch.index || 0, textArea);
  }
  if (match.includes(ECommands.place)) {
    return processPlaceCommand(text, match, commandMatch.index || 0, textArea);
  }
  if (match.includes(ECommands.today)) {
    return processTodayCommand(text, match, commandMatch.index || 0, textArea);
  }
  return text;
};
