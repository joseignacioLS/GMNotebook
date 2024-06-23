import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  const mock = {
    children: "button content",
    onClick: jest.fn(),
    addClass: "testClass",
  };

  it("renders", () => {
    render(<Button {...mock} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("shows text", () => {
    render(<Button {...mock} />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(mock.children);
  });

  it("launches event", () => {
    render(<Button {...mock} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mock.onClick).toHaveBeenCalledTimes(1);
  });

  it("includes css Class", () => {
    render(<Button {...mock} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("button");
    expect(button).toHaveClass(mock.addClass);
  });

  it("gets disabled", () => {
    render(<Button {...mock} disabled={true} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
