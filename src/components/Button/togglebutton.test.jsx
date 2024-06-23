import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ToggleButton from "./ToggleButton";

describe("ToggleButton", () => {
  const mock = {
    isOn: true,
    leftOption: "left",
    rightOption: "right",
    leftButton: <button data-testid="leftButton">LeftButton</button>,
    rightButton: <button data-testid="rightButton">RightButton</button>,
  };

  it("renders", () => {
    const result = render(<ToggleButton {...mock} />);
    const button = result.container.querySelector("div.wrapper");
    expect(button).toBeInTheDocument();

    const leftOption = result.container.querySelector(
      "div.wrapper > span:first-child"
    );
    expect(leftOption).toHaveTextContent(mock.leftOption);

    const rightOption = result.container.querySelector(
      "div.wrapper > span:last-child"
    );
    expect(rightOption).toHaveTextContent(mock.rightOption);
  });
  it("shows right button", () => {
    render(<ToggleButton {...mock} />);

    const rightButton = screen.getByTestId("rightButton");
    expect(rightButton).toBeInTheDocument();
  });
  it("shows left button", () => {
    render(<ToggleButton {...{ ...mock, isOn: false }} />);

    const leftButton = screen.getByTestId("leftButton");
    expect(leftButton).toBeInTheDocument();
  });
});
