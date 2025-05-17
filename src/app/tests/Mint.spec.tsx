import { expect, test } from "vitest";
import { cleanup, fireEvent, getByRole, screen } from "@testing-library/react";
import { setup } from "./fixtures/fixtures";

test("sucessful mint transaction", async () => {
  setup({
    xlmBalance: 20,
    usdcBalance: 1000,
    cusdBalance: 1000,
    txFails: false,
  });

  // click connect wallet button
  await fireEvent.click(
    await getByRole(await screen.findByTestId("header"), "button", {
      name: "Sign In",
    }),
  );

  // input swap transacton value
  const input = await screen.findByRole("textbox");
  await expect(input).toBeTruthy();
  fireEvent.change(input, { target: { value: "500" } });
  expect((input as HTMLInputElement).value).toBe("500");

  // click mint to submit transaction and open dialog
  const mintButton = await getByRole(
    await screen.findByTestId("swap"),
    "button",
    {
      name: "Mint",
    },
  );
  await expect(mintButton).toBeTruthy();
  await fireEvent.click(mintButton);
  await expect(await screen.findByText("Mint status")).toBeTruthy();

  // await expect(await screen.findByText("Mint success!"));
});

test.skip("failed mint transaction", async () => {
  setup({
    xlmBalance: 20,
    usdcBalance: 1000,
    cusdBalance: 1000,
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
  expect((input as HTMLInputElement).value).toBe("23");

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
