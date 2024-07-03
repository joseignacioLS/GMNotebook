import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Page", () => {
  it("renders", () => {
    const { getByRole } = render(<Page />);

    const main = getByRole("main");

    expect(main).toBeInTheDocument();
  });
});
