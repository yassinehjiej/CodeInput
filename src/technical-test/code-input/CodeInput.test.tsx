import { render, screen, fireEvent } from "@testing-library/react";
import CodeInput from "./CodeInput";

test("Should render a specified number of inputs", async () => {
  render(
    <CodeInput
      length={8}
      onCodeFull={(code: string) => {
        console.log({ code });
      }}
    />
  );

  const inputs = await screen.findAllByTestId("input");
  expect(inputs).toHaveLength(8);
});

test("input should be void", async () => {
  render(
    <CodeInput
      length={4}
      onCodeFull={(code: string) => {
        console.log({ code });
      }}
    />
  );

  const inputs = screen.getAllByTestId("input") as HTMLInputElement[];
  inputs.forEach((input) => {
    expect(input.value).toBe("");
  });
});

test("Inputs should accept numbers only", async () => {
  render(
    <CodeInput
      length={4}
      onCodeFull={(code: string) => {
        console.log({ code });
      }}
    />
  );

  const inputs = screen.getAllByTestId("input") as HTMLInputElement[];
  inputs.forEach((input) => {
    fireEvent.change(input, { target: { value: "a" } });
  });

  inputs.forEach((input) => {
    expect(input.value).toBe("");
    expect(isNaN(parseFloat(input.value))).toBe(true);
  });

  inputs.forEach((input) => {
    fireEvent.change(input, { target: { value: 9 } });
  });

  inputs.forEach((input) => {
    expect(isNaN(parseFloat(input.value))).toBe(false);
  });
});
