import * as React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { ReactTransliterate } from "./index";

const server = setupServer(
  rest.get("https://inputtools.google.com/request", (_, res, ctx) => {
    return res(ctx.json(["SUCCESS", [["there", ["hi", "hey", "hello"]]]]));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ReactTransliterate", () => {
  it("is truthy", () => {
    expect(ReactTransliterate).toBeTruthy();
  });

  it("renders without errors", () => {
    const mockValue = "";
    const mockOnChangeText = jest.fn();
    render(
      <ReactTransliterate value={mockValue} onChangeText={mockOnChangeText} />,
    );
  });

  it("renders passed value in the input", () => {
    const mockData = "MOCK_VALUE";
    const mockValue = mockData;
    const mockOnChangeText = jest.fn();
    render(
      <ReactTransliterate value={mockValue} onChangeText={mockOnChangeText} />,
    );
    expect(screen.getByDisplayValue(mockData)).toBeInTheDocument();
  });

  it("calls onChangeText on user input", async () => {
    const mockData = "MOCK_VALUE";
    const mockValue = mockData;
    const mockOnChangeText = jest.fn();
    render(
      <ReactTransliterate value={mockValue} onChangeText={mockOnChangeText} />,
    );
    fireEvent.change(screen.getByTestId("rt-input-component"), {
      target: { value: "H" },
    });
    await waitFor(() => {
      expect(screen.getByTestId("rt-suggestions-list")).toBeInTheDocument();
      expect(mockOnChangeText).toBeCalled();
    });
  });

  it("renders suggestions list", async () => {
    const mockData = "MOCK_VALUE";
    const mockValue = mockData;
    const mockOnChangeText = jest.fn();

    render(
      <ReactTransliterate value={mockValue} onChangeText={mockOnChangeText} />,
    );
    fireEvent.change(screen.getByTestId("rt-input-component"), {
      target: { value: "there" },
    });
    await waitFor(() => {
      expect(screen.getByText("hi")).toBeInTheDocument();
    });
  });
});
