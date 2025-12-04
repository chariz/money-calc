import { describe, expect, it } from "vitest";
import Money from ".";

describe("calculations", () => {
	it("adds", () => {
		expect(new Money("0.00")
			.add("12.34").amount)
			.toEqual("12.34");
		expect(new Money("0.00")
			.add("-12.34").amount)
			.toEqual("-12.34");
		expect(new Money("12.34")
			.add("56.78").amount)
			.toEqual("69.12");
		expect(new Money("12.34")
			.add("-56.78").amount)
			.toEqual("-44.44");
		expect(new Money("-123.45")
			.add("678.90").amount)
			.toEqual("555.45");
		expect(new Money("123.45")
			.add("-678.90").amount)
			.toEqual("-555.45");
		expect(new Money("12.34")
			.add("56.78", "90.12").amount)
			.toEqual("159.24");
		expect(new Money("90.12")
			.add("-56.78", "12.34").amount)
			.toEqual("45.68");
	});

	it("subtracts", () => {
		expect(new Money("0.00")
			.subtract("12.34").amount)
			.toEqual("-12.34");
		expect(new Money("0.00")
			.subtract("-12.34").amount)
			.toEqual("12.34");
		expect(new Money("12.34")
			.subtract("56.78").amount)
			.toEqual("-44.44");
		expect(new Money("12.34")
			.subtract("-56.78").amount)
			.toEqual("69.12");
		expect(new Money("-123.45")
			.subtract("678.90").amount)
			.toEqual("-802.35");
		expect(new Money("123.45")
			.subtract("-678.90").amount)
			.toEqual("802.35");
		expect(new Money("12.34")
			.subtract("56.78", "90.12").amount)
			.toEqual(
				"-134.56"
			);
		expect(new Money("90.12")
			.subtract("-56.78", "12.34").amount)
			.toEqual(
				"134.56"
			);
	});

	it("multiplies", () => {
		expect(new Money("0.00")
			.mul("12.34").amount)
			.toEqual("0.00");
		expect(new Money("0.00")
			.mul("-12.34").amount)
			.toEqual("0.00");
		expect(new Money("12.34")
			.mul("56.78").amount)
			.toEqual("700.67");
		expect(new Money("12.34")
			.mul("-56.78").amount)
			.toEqual("-700.67");
		expect(new Money("-123.45")
			.mul("678.90").amount)
			.toEqual("-83810.20");
		expect(new Money("123.45")
			.mul("-678.90").amount)
			.toEqual("-83810.20");
		expect(new Money("12.34")
			.mul("56.78", "90.12").amount)
			.toEqual("63143.95");
		expect(new Money("90.12")
			.mul("-56.78", "12.34").amount)
			.toEqual(
				"-63143.95"
			);
	});

	it("divides", () => {
		expect(new Money("0.00")
			.div("12.34").amount)
			.toEqual("0.00");
		expect(new Money("0.00")
			.div("-12.34").amount)
			.toEqual("0.00");
		expect(new Money("12.34")
			.div("56.78").amount)
			.toEqual("0.22");
		expect(new Money("12.34")
			.div("-56.78").amount)
			.toEqual("-0.22");
		expect(new Money("-123.45")
			.div("678.90").amount)
			.toEqual("-0.18");
		expect(new Money("123.45")
			.div("-678.90").amount)
			.toEqual("-0.18");
		expect(new Money("12.34")
			.div("56.78", "90.12").amount)
			.toEqual("0.00");
		expect(new Money("90.12")
			.div("-56.78", "12.34").amount)
			.toEqual("-0.13");
	});

	it("modulus", () => {
		expect(new Money("0.00")
			.mod("12.00").amount)
			.toEqual("0.00");
		expect(new Money("0.00")
			.mod("-12.00").amount)
			.toEqual("0.00");
		expect(new Money("12.00")
			.mod("56.00").amount)
			.toEqual("12.00");
		expect(new Money("12.00")
			.mod("-56.00").amount)
			.toEqual("12.00");
		expect(new Money("-123.00")
			.mod("678.00").amount)
			.toEqual("-123.00");
		expect(new Money("123.00")
			.mod("-678.00").amount)
			.toEqual("123.00");
		expect(new Money("-3.00")
			.mod("2.00").amount)
			.toEqual("-1.00");
		expect(new Money("3.00")
			.mod("-2.00").amount)
			.toEqual("1.00");
	});

	it("percent", () => {
		expect(new Money("0.00")
			.percent("12.34").amount)
			.toEqual("0.00");
		expect(new Money("0.00")
			.percent("-12.34").amount)
			.toEqual("0.00");
		expect(new Money("12.34")
			.percent("56.78").amount)
			.toEqual("7.01");
		expect(new Money("12.34")
			.percent("-56.78").amount)
			.toEqual("-7.01");
		expect(new Money("-123.45")
			.percent("678.90").amount)
			.toEqual("-838.10");
		expect(new Money("123.45")
			.percent("-678.90").amount)
			.toEqual("-838.10");
		expect(new Money("12.34")
			.percent("56.78").amount)
			.toEqual("7.01");
		expect(new Money("90.12")
			.percent("-56.78").amount)
			.toEqual("-51.17");
	});

	it("negate", () => {
		expect(new Money("0.00")
			.negate().amount)
			.toEqual("0.00");
		expect(new Money("-0.00")
			.negate().amount)
			.toEqual("0.00");
		expect(new Money("12.34")
			.negate().amount)
			.toEqual("-12.34");
		expect(new Money("12.34")
			.negate()
			.negate().amount)
			.toEqual("12.34");
		expect(new Money("-123.45")
			.negate().amount)
			.toEqual("123.45");
		expect(new Money("123.45")
			.negate()
			.add("123.45").amount)
			.toEqual("0.00");
	});
});
