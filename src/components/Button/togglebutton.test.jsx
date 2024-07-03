import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import ToggleButton from "./ToggleButton";

describe("ToggleButton", () => {
  const mock = {
    isOn: true,
    leftOption: "left",
    rightOption: "right",
    leftButton: <span data-testid="leftButton">LeftButton</span>,
    rightButton: <span data-testid="rightButton">RightButton</span>,
    onClick: jest.fn(),
  };

  it("renders", () => {
    const { getByText } = render(<ToggleButton {...mock} />);

    const leftOption = getByText("left");
    expect(leftOption).toBeInTheDocument();

    const rightOption = getByText("right");
    expect(rightOption).toBeInTheDocument();
  });
  it("shows right button", () => {
    const { getByTestId } = render(<ToggleButton {...mock} />);

    const rightButton = getByTestId("rightButton");
    expect(rightButton).toBeInTheDocument();
  });
  it("shows left button", () => {
    const { getByTestId } = render(
      <ToggleButton {...{ ...mock, isOn: false }} />
    );

    const leftButton = getByTestId("leftButton");
    expect(leftButton).toBeInTheDocument();
  });

  it("changes on click", async () => {
    const { getByText } = render(<ToggleButton {...mock} />);
    fireEvent.click(getByText("RightButton"));
    expect(mock.onClick).toHaveBeenCalledTimes(1);
  });
});
