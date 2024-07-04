import { isValidElement } from "react";
import { processLine } from "./dom";
import { render } from "@testing-library/react";
import { specialLinesConfig } from "./constans";

describe("process line", () => {
  it("returns a react node", () => {
    const result = processLine("this is the line note:line", 0, false);
    expect(isValidElement(result)).toBe(true);
  });
  it("Title shows the correct text", () => {
    const { container } = render(processLine("# Title", 0, false));
    const result = container.querySelector(
      `p.text-${specialLinesConfig.title.config.type}`
    );
    expect(result).not.toBeNull();
    expect(result.innerHTML).toBe("<span>Title</span>");
  });
  it("Subtitle shows the correct text", () => {
    const { container } = render(processLine("## Title", 0, false));
    const result = container.querySelector(
      `p.text-${specialLinesConfig.subtitle.config.type}`
    );
    expect(result).not.toBeNull();
    expect(result.innerHTML).toBe("<span>Title</span>");
  });
  it("List shows the correct text", () => {
    const { container } = render(processLine("- Title", 0, false));
    const result = container.querySelector(
      `p.text-${specialLinesConfig.list.config.type}`
    );
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
