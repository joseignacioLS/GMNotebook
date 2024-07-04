import { isValidElement } from "react";
import {
  extractReferences,
  filterReferences,
  filterReferencesBasedOnVisibility,
  getSelectedParagraphIndex,
  processLine,
} from "./text";
import { render } from "@testing-library/react";
import { checkIfVisible } from "./dom";

jest.mock("./dom", () => ({
  checkIfVisible: jest.fn(),
}));

describe("process line", () => {
  it("returns a react node", () => {
    const result = processLine("this is the line note:line", 0, false);
    expect(isValidElement(result)).toBe(true);
  });
  it("Title shows the correct text", () => {
    const { container } = render(processLine("# Title", 0, false));
    const result = container.querySelector("p.text-title");
    expect(result).not.toBeNull();
    expect(result.innerHTML).toBe("<span>Title</span>");
  });
  it("Subtitle shows the correct text", () => {
    const { container } = render(processLine("## Title", 0, false));
    const result = container.querySelector("p.text-subtitle");
    expect(result).not.toBeNull();
    expect(result.innerHTML).toBe("<span>Title</span>");
  });
  it("Should return text without decoration", () => {
    const result = processLine("Simple text", 0, false);
    expect(result.props.children[0]).toBe("Simple text");
    const resultB = processLine("Simple text", 0, true);
    expect(resultB.props.children[0]).toBe("Simple text");
  });
  it("Should generate a note", () => {
    const { container } = render(processLine("This is a note:note", 0, false));
    const result = container.querySelector("span.reference");
    expect(result).not.toBeNull();
    expect(result.innerHTML).toBe("note");
  });
  it("Should generate a img", () => {
    const { container } = render(processLine("This is a img:note", 0, false));
    const result = container.querySelector("img");
    expect(result).not.toBeNull();
  });
});

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
