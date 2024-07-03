import { isValidElement } from "react";
import {
  checkForSubtitle,
  checkForTitle,
  extractReferences,
  formatTitleLine,
  getWordCount,
  processLine,
  removeReferences,
} from "./text";

describe("getWordCount", () => {
  const result = getWordCount("");
  it("returns a number", () => {
    expect(typeof result).toBe("number");
  });

  it("returns the number of words", () => {
    const count = Math.floor(Math.random() * 30);
    const phrase = [...new Array(count).keys()].join(" ");
    expect(getWordCount(phrase)).toBe(count);
  });
});

describe("checkForTitle", () => {
  expect(checkForTitle("# Title")).not.toBeNull();
  expect(checkForTitle("Title")).toBeNull();
  expect(checkForTitle("## Title")).toBeNull();
});

describe("checkForSubtitle", () => {
  expect(checkForSubtitle("## Title")).not.toBeNull();
  expect(checkForSubtitle("Title")).toBeNull();
  expect(checkForSubtitle("# Title")).toBeNull();
});

describe("formatTitleLine", () => {
  const result = formatTitleLine("# Title line", 0, true);
  expect(result.props.children.props.children[0]).toBe("Title line");
});

describe("remove references", () => {
  const mock = "note:hola que note:tal va.\nnote:por ahí note:";
  it("returns a string", () => {
    const result = removeReferences(mock, []);
    expect(typeof result).toBe("string");
  });
  it("removes only the passed references", () => {
    const result = removeReferences(mock, ["hola"]);
    expect(result.includes("note:hola")).toBe(false);
    expect(result.includes("hola")).toBe(true);
    expect(result.includes("note:tal")).toBe(true);
  });
});

describe("extract references", () => {
  const mock = "note:hola que note:tal va.\nnote:por ahí note:";
  it("returns an array of strings", () => {
    const result = extractReferences(mock);
    expect(Array.isArray(result)).toBe(true);
    expect(result.every((e) => typeof e === "string")).toBe(true);
  });
});

describe("process line", () => {
  const mock = ["this is the line note:line", 0, false];
  it("returns a react node", () => {
    const result = processLine(...mock);
    expect(isValidElement(result)).toBe(true);
  });
  it("Title shows the correct text", () => {
    const result = processLine("# Title", 0, false);
    expect(result.props.children.props.children[0]).toBe("Title");
    const resultB = processLine("# Title", 0, true);
    expect(resultB.props.children.props.children[0]).toBe("Title");
  });
  it("Subtitle shows the correct text", () => {
    const result = processLine("## Title", 0, false);
    expect(result.props.children.props.children[0]).toBe("Title");
    const resultB = processLine("## Title", 0, true);
    expect(resultB.props.children.props.children[0]).toBe("Title");
  });
  it("Should return text without decoration", () => {
    const result = processLine("Simple text", 0, false);
    expect(result.props.children[0]).toBe("Simple text");
    const resultB = processLine("Simple text", 0, true);
    expect(resultB.props.children[0]).toBe("Simple text");
  });
});
