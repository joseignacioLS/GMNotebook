import { templates } from "@/context/constants";
import { ECommands, regex } from "./constants";
import predictor from "./markov/markov";
import { useContext } from "react";
import { DataContext } from "@/context/data";
import { toastContext } from "@/context/toast";

const getCommandParam = (match: string) => {
  return match.match(/\(([a-z0-9]*)\)/)?.[1];
};

const processGenericCommand = (
  text: string,
  matchPosition: number,
  target: any,
  targetString: string,
  replacementString: string
) => {
  const scrollTop = target.scrollTop;
  requestAnimationFrame(() => {
    target.scrollTop = scrollTop;
    target.selectionEnd = matchPosition + replacementString.length;
  });
  return text.replace(targetString, replacementString);
};

const processTodayCommand = (
  text: string,
  match: string,
  matchPosition: number,
  target: any
) => {
  const replacementString = new Date().toLocaleDateString();
  return processGenericCommand(
    text,
    matchPosition,
    target,
    match,
    replacementString
  );
};

const predictConfig = {
  name: {
    window: 3,
    windowPredict: 1,
    minLength: 4,
    maxLength: 12,
  },
  place: {
    short: {
      window: 3,
      windowPredict: 1,
      minLength: 3,
      maxLength: 10,
    },
    long: {
      window: 3,
      windowPredict: 1,
      minLength: 8,
      maxLength: 20,
    },
  },
};

export const useCommand = () => {
  const { data, updateData } = useContext(DataContext);
  const { showToastError } = useContext(toastContext);

  const processNameCommand = (
    text: string,
    match: string,
    matchPosition: number,
    target: any
  ) => {
    const selectedPredictor = predictor.tolkienNames;
    if (!selectedPredictor.trained) {
      showToastError("There was an error generating the name");
      return text;
    }
    const replacementString = selectedPredictor.predict(predictConfig.name);

    return processGenericCommand(
      text,
      matchPosition,
      target,
      match,
      replacementString
    );
  };

  const processPlaceCommand = (
    text: string,
    match: string,
    matchPosition: number,
    target: any
  ) => {
    const param = getCommandParam(match);
    const selectedPredictor = predictor.tolkienPlaces;
    if (!selectedPredictor.trained) {
      showToastError("There was an error generating the name");
      return text;
    }
    const replacementString = selectedPredictor.predict(
      predictConfig.place[param === "short" ? "short" : "long"]
    );
    return processGenericCommand(
      text,
      matchPosition,
      target,
      match,
      replacementString
    );
  };

  const processChrCommand = (
    text: string,
    match: string,
    matchPosition: number,
    target: any
  ) => {
    const selectedPredictor = predictor.tolkienNames;
    if (!selectedPredictor.trained) {
      showToastError("There was an error generating the name");
      return text;
    }
    let name = "";
    while (!name || data?.[name] !== undefined) {
      console.log(data[name] === undefined, name);
      name = selectedPredictor.predict(predictConfig.name);
    }
    const safeName = name.replace(/ /g, "");
    console.log({ name, safeName });
    const replacementString = `note:${safeName}`;
    setTimeout(() => {
      updateData(
        {
          [safeName]: {
            key: safeName,
            title: name,
            text: templates.character.replace(/<name>/g, name),
            display: name,
            showInTree: false,
            showInTabs: false,
          },
        },
        false
      );
    }, 0);
    return processGenericCommand(
      text,
      matchPosition,
      target,
      match,
      replacementString
    );
  };

  const commandToFn: { [key in ECommands]: (...args: any) => string } = {
    [ECommands.name]: processNameCommand,
    [ECommands.place]: processPlaceCommand,
    [ECommands.today]: processTodayCommand,
    [ECommands.chr]: processChrCommand,
  };

  const processCommand = (textArea: HTMLElement, text: string) => {
    const match = text.match(regex.command);
    if (!match) return text;
    const matchStr = match[0];
    const command = matchStr.trimEnd().split("(")[0] as ECommands;
    if (!command) return text;
    return (
      commandToFn[command]?.(
        text,
        matchStr,
        match.index || 0,
        textArea,
        data,
        updateData
      ) || text
    );
  };
  return processCommand;
};
