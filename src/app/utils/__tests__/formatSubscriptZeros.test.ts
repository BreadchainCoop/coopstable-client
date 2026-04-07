import { describe, expect, test } from "vitest";
import { formatSubscriptZeros, formatCUSDFromStroops } from "../tokenFormatting";

describe("formatSubscriptZeros", () => {
  test("returns zero type for '0'", () => {
    expect(formatSubscriptZeros("0")).toEqual({ type: "zero" });
  });

  test("returns zero type for empty-ish values", () => {
    expect(formatSubscriptZeros("0.0")).toEqual({ type: "zero" });
    expect(formatSubscriptZeros("0.000000")).toEqual({ type: "zero" });
  });

  test("returns normal type for values >= 1", () => {
    expect(formatSubscriptZeros("15")).toEqual({
      type: "normal",
      formatted: "15",
    });
    expect(formatSubscriptZeros("1.5")).toEqual({
      type: "normal",
      formatted: "1.5",
    });
    expect(formatSubscriptZeros("1234.56")).toEqual({
      type: "normal",
      formatted: "1,234.56",
    });
  });

  test("returns normal type for < 3 leading zeros", () => {
    expect(formatSubscriptZeros("0.07")).toEqual({
      type: "normal",
      formatted: "0.07",
    });
    expect(formatSubscriptZeros("0.007")).toEqual({
      type: "normal",
      formatted: "0.007",
    });
  });

  test("trims trailing zeros in normal mode", () => {
    expect(formatSubscriptZeros("0.0700")).toEqual({
      type: "normal",
      formatted: "0.07",
    });
    expect(formatSubscriptZeros("1.5000")).toEqual({
      type: "normal",
      formatted: "1.5",
    });
    expect(formatSubscriptZeros("15.0000000")).toEqual({
      type: "normal",
      formatted: "15",
    });
  });

  test("returns subscript type for 3+ leading zeros", () => {
    expect(formatSubscriptZeros("0.0007")).toEqual({
      type: "subscript",
      wholePart: "0",
      zeroCount: 3,
      significant: "7",
    });
    expect(formatSubscriptZeros("0.00007")).toEqual({
      type: "subscript",
      wholePart: "0",
      zeroCount: 4,
      significant: "7",
    });
  });

  test("shows up to 4 significant digits after subscript", () => {
    expect(formatSubscriptZeros("0.0000345678")).toEqual({
      type: "subscript",
      wholePart: "0",
      zeroCount: 4,
      significant: "3456",
    });
  });

  test("trims trailing zeros in significant digits", () => {
    expect(formatSubscriptZeros("0.00000345")).toEqual({
      type: "subscript",
      wholePart: "0",
      zeroCount: 5,
      significant: "345",
    });
    expect(formatSubscriptZeros("0.000000001")).toEqual({
      type: "subscript",
      wholePart: "0",
      zeroCount: 8,
      significant: "1",
    });
  });

  test("respects custom significantDigits option", () => {
    expect(
      formatSubscriptZeros("0.0000345678", { significantDigits: 2 })
    ).toEqual({
      type: "subscript",
      wholePart: "0",
      zeroCount: 4,
      significant: "34",
    });
  });

  test("limits normal mode to 4 decimal places", () => {
    expect(formatSubscriptZeros("0.123456")).toEqual({
      type: "normal",
      formatted: "0.1235",
    });
    expect(formatSubscriptZeros("0.01999")).toEqual({
      type: "normal",
      formatted: "0.02",
    });
  });
});

describe("formatCUSDFromStroops", () => {
  test("converts stroops to decimal and formats", () => {
    // 345 stroops = 0.0000345 (7 decimal places)
    expect(formatCUSDFromStroops("345")).toEqual({
      type: "subscript",
      wholePart: "0",
      zeroCount: 4,
      significant: "345",
    });
  });
});
