import { generateColor } from "./color";

describe("generateColor", () => {
  const result = generateColor("0");
  it("returns a string", () => {
    expect(typeof result).toBe("string");
  });

  it("returns a rgb color", () => {
    expect(result.match(/^#[0-9ABCDEF]{6}$/i)).not.toBeNull();
  });

  it("returns different colors based on input", () => {
    const inputs = ["test", "prueba", "jose", "colores", "Carmen"];
    const results = [...new Set(inputs.map((input) => generateColor(input)))];
    expect(inputs.length === results.length).toBe(true);
  });
});
