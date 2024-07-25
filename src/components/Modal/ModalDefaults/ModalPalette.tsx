import Input from "@/components/Input/Input";
import { colorContext } from "@/context/colors";
import { useContext, useEffect, useState } from "react";

import styles from "./modalpalette.module.scss";
import ToggleButton from "@/components/Button/ToggleButton";

const ModalPalette: React.FC = () => {
  const {
    darkMode,
    toggleDarkMode,
    paletteConfig: pconfig,
    updatePaletteConfig,
    generateSecondaryColor,
  } = useContext(colorContext);

  const [previewRange, setPreviewRange] = useState<number[]>([0, 360, 0]);

  const generatePreviewRange = (hue: number | undefined, range: number) => {
    if (hue === undefined) {
      return setPreviewRange([0, 360]);
    }
    const newPreviewRange = [hue - range / 2, hue + range / 2];
    setPreviewRange(newPreviewRange);
  };

  useEffect(() => {
    generatePreviewRange(pconfig.hue, pconfig.range);
  }, [pconfig.hue, pconfig.range]);

  return (
    <div>
      <h2>Configure your palette</h2>
      <section className={styles.inputs}>
        <label>
          <h3>Theme</h3>
          <ToggleButton
            isOn={darkMode}
            leftButton={
              <span className={styles["material-symbols-outlined"]}>
                light_mode
              </span>
            }
            rightButton={
              <span className={styles["material-symbols-outlined"]}>
                dark_mode
              </span>
            }
            onClick={toggleDarkMode}
          />
        </label>
        <h3>Color Palette</h3>
        <Input
          value={pconfig.hue}
          onChange={(e) => {
            updatePaletteConfig("hue", +e.currentTarget.value);
          }}
          label="Hue"
          type="range"
          config={{
            min: 0,
            max: 360,
            step: 15,
          }}
        />
        <Input
          value={pconfig.saturation}
          onChange={(e) => {
            updatePaletteConfig("saturation", +e.currentTarget.value);
          }}
          label="Saturation"
          type="range"
          config={{ min: 20, max: 80, step: 5 }}
        />
        <Input
          value={pconfig.luminosity}
          onChange={(e) => {
            updatePaletteConfig("luminosity", +e.currentTarget.value);
          }}
          label="Luminosity"
          type="range"
          config={{ min: 20, max: 80, step: 10 }}
        />
        <Input
          value={pconfig.range}
          onChange={(e) => {
            updatePaletteConfig("range", +e.currentTarget.value);
          }}
          label="Range"
          type="range"
          config={{ min: 0, max: 360, step: 10 }}
        />
      </section>
      <div
        className={styles.colorPreview}
        style={{
          background: `linear-gradient(90deg in hsl ${
            pconfig.hue !== undefined && pconfig.range > 180
              ? "longer"
              : "shorter"
          } hue, hsl(${previewRange[0]}, ${pconfig.saturation}%, ${
            pconfig.luminosity
          }%), hsl(${previewRange[1]}, ${pconfig.saturation}%, ${
            pconfig.luminosity
          }%))`,
        }}
      >
        <span
          style={{
            color: generateSecondaryColor(
              pconfig.hue || 0,
              pconfig.saturation,
              pconfig.luminosity
            ),
          }}
        >
          Preview
        </span>
      </div>
    </div>
  );
};

export default ModalPalette;
