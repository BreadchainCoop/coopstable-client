import { expect, test } from "vitest";
import { cleanup, fireEvent, getByRole, screen } from "@testing-library/react";
import { setup, signin } from "./fixtures/fixtures";

test.skip("successful burn transaction", async () => {
  setup({
    xlmBalance: 20,
    usdcBalance: 1000,
    cusdBalance: 1000,
    txFails: false,
  });

  // click connect wallet button
  signin();

  // input swap transacton value
  const input = await screen.findByRole("textbox");
  await expect(input).toBeTruthy();
  fireEvent.change(input, { target: { value: "23" } });
  expect((input as HTMLInputElement).value).toBe("23");

  fireEvent.change(input, { target: { value: "23Z" } });
  expect((input as HTMLInputElement).value).toBe("23");

  await fireEvent.click(await screen.getByText("Burn"));

  // click mint to submit transaction and open dialog
  const mintButton = await getByRole(
    await screen.findByTestId("swap"),
    "button",
    {
      name: "Burn",
    },
  );
  await expect(mintButton).toBeTruthy();
  await fireEvent.click(mintButton);
  await expect(await screen.findByText("Burn status")).toBeTruthy();

  cleanup();
});

test("failed burn transaction", async () => {
  setup({
    xlmBalance: 0,
    usdcBalance: 0,
    cusdBalance: 0,
    txFails: true,
  });

  const signInButton = await getByRole(
    await screen.findByTestId("header"),
    "button",
    {
      name: "Sign In",
    },
  );
  await fireEvent.click(signInButton);
  // input swap transacton value
  const input = await screen.findByRole("textbox");
  fireEvent.change(input, { target: { value: "23" } });
  // click mint to submit transaction and open dialog
  const mintButton = await getByRole(
    await screen.findByTestId("swap"),
    "button",
    {
      name: "Mint",
    },
  );
  await fireEvent.click(mintButton);

  // dialog open, tx in progress

  cleanup();
});
