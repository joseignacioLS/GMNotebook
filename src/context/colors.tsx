"use client";

import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { rng } from "@/utils/math";
import { stringToNumber } from "@/utils/text";
import { ReactElement, createContext, useEffect, useState } from "react";

interface colorOutputI {
  darkMode: boolean;
  toggleDarkMode: any;
  generateColor: (seed: string) => string;
  updatePaletteConfig: any;
  paletteConfig: {
    hue: number | undefined;
    range: number;
    saturation: number;
    luminosity: number;
  };
}

const initialPaletteConfig = {
  hue: 0,
  range: 360,
  saturation: 20,
  luminosity: 40,
};

export const colorContext = createContext<colorOutputI>({
  darkMode: false,
  toggleDarkMode: () => {},
  generateColor: (seed: string) => seed,
  updatePaletteConfig: () => {},
  paletteConfig: initialPaletteConfig,
});

export const ColorProvider = ({ children }: { children: ReactElement }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [paletteConfig, setPaletteConfig] = useState(initialPaletteConfig);

  const toggleDarkMode = () =>
    setDarkMode((v) => {
      saveToLocalStorage(!v, "darkMode");
      return !v;
    });

  const generateColor = (seed: string): string => {
    let hue = Math.floor(rng(stringToNumber(seed)) * 360);
    if (paletteConfig.hue !== undefined) {
      hue =
        paletteConfig.hue +
        Math.floor(rng(stringToNumber(seed)) * paletteConfig.range) * 2 -
        paletteConfig.range;
    }
    return `hsl(${hue}, ${paletteConfig.saturation}%, ${paletteConfig.luminosity}%)`;
  };

  const updatePaletteConfig = (key: string, value: number) => {
    setPaletteConfig((oldState) => {
      const newState = { ...oldState, [key]: value };
      saveToLocalStorage(newState, "colorConfig");
      return newState;
    });
  };

  const checkPaletteConfig = (config: any) => {
    if (config.hue === undefined) return false;
    if (config.range === undefined) return false;
    if (config.saturation === undefined) return false;
    if (config.luminosity === undefined) return false;
    return true;
  };

  const retrieveColorConfig = () => {
    const retrieved = retrieveLocalStorage("colorConfig");
    if (!retrieved) return;
    const newConfig = JSON.parse(retrieved);
    if (!checkPaletteConfig(newConfig)) return;
    setPaletteConfig(newConfig);
  };

  const retrieveDarkMode = () => {
    const retrieved = retrieveLocalStorage("darkMode");
    if (retrieved === undefined) return;
    setDarkMode(retrieved === "true");
  };

  useEffect(() => {
    retrieveColorConfig();
    retrieveDarkMode();
  }, []);

  return (
    <colorContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        generateColor,
        updatePaletteConfig,
        paletteConfig,
      }}
    >
      {children}
    </colorContext.Provider>
  );
};
