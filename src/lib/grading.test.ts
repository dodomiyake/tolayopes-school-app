import { describe, expect, it } from "vitest";
import { average, gradeFor, ordinal, positions, scoreError } from "./grading";
import { formatNaira, formatNairaShort, paidPercent } from "./money";

describe("gradeFor", () => {
  it("maps totals onto the default bands", () => {
    expect(gradeFor(100).grade).toBe("A");
    expect(gradeFor(75).grade).toBe("A");
    expect(gradeFor(74.5).grade).toBe("B");
    expect(gradeFor(55).grade).toBe("C");
    expect(gradeFor(0).grade).toBe("E");
  });

  it("refuses a total no band covers", () => {
    expect(() => gradeFor(101)).toThrow();
  });
});

describe("positions", () => {
  it("gives tied scores the same place and skips the next", () => {
    const p = positions([
      { id: "a", score: 80 },
      { id: "b", score: 90 },
      { id: "c", score: 85 },
      { id: "d", score: 85 },
    ]);
    expect([p.get("b"), p.get("c"), p.get("d"), p.get("a")]).toEqual([1, 2, 2, 4]);
  });
});

describe("ordinal", () => {
  it("handles the teens", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 32].map(ordinal)).toEqual([
      "1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "32nd",
    ]);
  });
});

describe("average", () => {
  it("rounds to one decimal place", () => {
    expect(average([78, 87, 75])).toBe(80);
    expect(average([70, 71, 71])).toBe(70.7);
    expect(average([])).toBe(0);
  });
});

describe("money", () => {
  it("formats kobo as naira", () => {
    expect(formatNaira(8_500_000)).toBe("₦85,000");
    expect(formatNairaShort(3_120_000_000)).toBe("₦31.2m");
    expect(formatNairaShort(85_000_000)).toBe("₦850k");
  });

  it("caps the paid share at 100%", () => {
    expect(paidPercent(12_000_000, 7_500_000)).toBe(63);
    expect(paidPercent(100, 500)).toBe(100);
    expect(paidPercent(0, 0)).toBe(100);
  });
});

describe("scoreError", () => {
  it("allows blanks, whole numbers and halves within the maximum", () => {
    expect(scoreError("", 20)).toBeNull();
    expect(scoreError("17", 20)).toBeNull();
    expect(scoreError("12.5", 20)).toBeNull();
    expect(scoreError("60", 60)).toBeNull();
  });
  it("rejects scores above the maximum and anything that is not a score", () => {
    expect(scoreError("21", 20)).toBe("Max is 20");
    expect(scoreError("-3", 20)).toBe("Use a whole number or .5");
    expect(scoreError("abc", 60)).toBe("Use a whole number or .5");
    expect(scoreError("12.3", 20)).toBe("Use a whole number or .5");
  });
});
