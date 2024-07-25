"use client";

import { retrieveLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { rng } from "@/utils/math";
import { stringToNumber } from "@/utils/text";
import { ReactElement, createContext, useEffect, useState } from "react";

interface colorOutputI {
  darkMode: boolean;
  toggleDarkMode: any;
  generateColor: (seed: string) => string[];
  generateSecondaryColor: (
    hue: number,
    saturation: number,
    luminosity: number
  ) => string;
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
  generateColor: (seed: string) => [seed],
  generateSecondaryColor: () => "",
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

  const generateSecondaryColor = (
    hue: number,
    saturation: number,
    luminosity: number
  ): string => {
    return `hsl(${hue}, ${saturation}%, ${luminosity > 40 ? 5 : 95}%)`;
  };

  const generateColor = (seed: string): string[] => {
    const hue =
      paletteConfig.hue +
      Math.floor(rng(stringToNumber(seed)) * paletteConfig.range) * 2 -
      paletteConfig.range;
    const color = `hsl(${hue}, ${paletteConfig.saturation}%, ${paletteConfig.luminosity}%)`;
    const complementary = generateSecondaryColor(
      hue,
      paletteConfig.saturation,
      paletteConfig.luminosity
    );
    return [color, complementary];
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
        generateSecondaryColor,
        updatePaletteConfig,
        paletteConfig,
      }}
    >
      {children}
    </colorContext.Provider>
  );
};
