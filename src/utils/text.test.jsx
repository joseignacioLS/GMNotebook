import {
  cleanTextSpaces,
  extractReferences,
  filterReferencesBasedOnVisibility,
  getSelectedParagraphIndex,
  processText,
} from "./text";
import { checkIfVisible, processLine } from "./dom";

jest.mock("./dom", () => ({
  checkIfVisible: jest.fn(),
  processLine: jest.fn(),
}));

describe("extractReferences", () => {
  const text =
    "Mock line with some note:Notes to test if note:references\n are note:extracted correctly.\nimg:fsfas.fsdafdas";
  const result = extractReferences(text);
  it("Extracts all the references", () => {
    expect(result.length).toBe(3);
  });
  it("Formats the references", () => {
    expect(
      result.every((r) => {
        return r.match(/^[A-Záéíóúüïñ0-9]+_[0-9]+_[0-9]+$/i);
      })
    ).toBe(true);
  });
});

describe("getSelectedParagraphIndex", () => {
  it("returns the correct paragraph index", () => {
    const text = "Paragraph 1\nParagraph 2\nParagraph 3";
    const index = getSelectedParagraphIndex(15, text);
    expect(index).toBe(1);
  });

  it("returns the first paragraph index if cursor is at the beginning", () => {
    const text = "Paragraph 1\nParagraph 2\nParagraph 3";
    const index = getSelectedParagraphIndex(0, text);
    expect(index).toBe(0);
  });
});

describe("filterReferencesBasedOnVisibility", () => {
  it("filters visible references correctly", () => {
    const text = "This is a line with a reference note:ref1.";
    checkIfVisible.mockReturnValueOnce(true);

    const filteredReferences = filterReferencesBasedOnVisibility(text);
    expect(filteredReferences).toEqual(["ref1_0_0"]);
  });

  it("filters out invisible references", () => {
    const text = "This is a line with a reference note:ref1.";
    checkIfVisible.mockReturnValueOnce(false);

    const filteredReferences = filterReferencesBasedOnVisibility(text);
    expect(filteredReferences).toEqual([]);
  });
});

describe("processText", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("acts on every line", () => {
    processText("This is a\nText to check\nif this works\ncorrectly", true);
    expect(processLine).toHaveBeenCalledTimes(4);
  });
  it("acts once on one line", () => {
    processText("This is a Text to check if this works correctly", true);
    expect(processLine).toHaveBeenCalledTimes(1);
  });
});

describe("cleanTextSpaces", () => {
  it("should remove multiple spaces", () => {
    const result = cleanTextSpaces("hola     que tal");
    expect(result.includes("  ")).toBe(false);
  });
  it("shold remove spaces at the beginning of the last empty paragraph", () => {
    const result = cleanTextSpaces("hola\n    ");
    expect(result.includes("\n ")).toBe(false);
  });
});
