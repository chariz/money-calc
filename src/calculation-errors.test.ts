import { describe, expect, it } from "vitest";
import Money from ".";

describe("calculation errors", () => {
	it("throws when dividing by zero", () => {
		expect(() => new Money("12.34")
			.div("0.00").amount)
			.toThrow(
				"Cannot divide by 0"
			);
		expect(() => new Money("-12.34")
			.div("0.00").amount)
			.toThrow(
				"Cannot divide by 0"
			);
	});

	it("throws when invalid value given", () => {
		// @ts-expect-error - Intentionally invalid
		expect(() => new Money("not a number!").amount)
			.toThrow(
				"Parameter is not a number: not a number!"
			);
		// @ts-expect-error - Intentionally invalid
		expect(() => new Money({ weird: true }).amount)
			.toThrow(
				"Invalid MoneyInput type"
			);
		expect(() => new Money("12.34")
			// @ts-expect-error - Intentionally invalid
			.add(null).amount)
			.toThrow(
				"Invalid MoneyInput type"
			);
		expect(() => new Money("12.34")
			// @ts-expect-error - Intentionally invalid
			.subtract("not a number!").amount)
			.toThrow(
				"Parameter is not a number: not a number!"
			);
		expect(() => new Money("12.34")
			// @ts-expect-error - Intentionally invalid
			.mul(56.78).amount)
			.toThrow(
				"Invalid MoneyInput type"
			);
	});

	it("throws when calculating decimal modulus", () => {
		expect(() => new Money("12.34")
			.mod("56.00").amount)
			.toThrow(
				"Modulus of non-integers not supported"
			);
		expect(() => new Money("12.00")
			.mod("56.78").amount)
			.toThrow(
				"Modulus of non-integers not supported"
			);
	});
});
