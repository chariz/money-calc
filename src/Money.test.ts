import { describe, expect, it } from "vitest";
import BigDecimal from "js-big-decimal";
import { Decimal128 } from "bson";
import Money, { Currency, MoneyJSON } from ".";

describe("Money", () => {
	describe("constructor", () => {
		it("accepts Decimal128", () => {
			const decimal128 = Decimal128.fromString("12.34");
			const money = new Money(decimal128);
			expect(money.amount)
				.toEqual("12.34");
		});

		it("accepts BigDecimal", () => {
			const bigDecimal = new BigDecimal("56.78");
			const money = new Money(bigDecimal);
			expect(money.amount)
				.toEqual("56.78");
		});

		it("accepts Money", () => {
			const originalMoney = new Money("12.34");
			const newMoney = new Money(originalMoney);
			expect(newMoney.amount)
				.toEqual("12.34");
		});

		it("accepts MoneyJSON", () => {
			const moneyJSON: MoneyJSON = {
				amount: "12.34",
				currency: Currency.USD
			};
			const money = new Money(moneyJSON);
			expect(money.amount)
				.toEqual("12.34");
		});
	});

	describe("toJSON", () => {
		it("returns amount and currency", () => {
			const money = new Money("12.34", Currency.USD);
			const json = money.toJSON();
			expect(json)
				.toEqual({ amount: "12.34", currency: "USD" });
		});

		it("handles different currencies", () => {
			const money = new Money("56.78", Currency.EUR);
			const json = money.toJSON();
			expect(json)
				.toEqual({ amount: "56.78", currency: "EUR" });
		});

		it("handles negative amounts", () => {
			const money = new Money("-123.45", Currency.GBP);
			const json = money.toJSON();
			expect(json)
				.toEqual({ amount: "-123.45", currency: "GBP" });
		});
	});

	describe("toString", () => {
		it("formats USD", () => {
			const money = new Money("12.34", Currency.USD);
			expect(money.toString())
				.toEqual("$12.34");
		});

		it("formats EUR", () => {
			const money = new Money("56.78", Currency.EUR);
			expect(money.toString())
				.toEqual("\u20AC56.78");
		});

		it("formats GBP", () => {
			const money = new Money("123.45", Currency.GBP);
			expect(money.toString())
				.toEqual("\u00A3123.45");
		});

		it("formats negatives", () => {
			const money = new Money("-12.34", Currency.USD);
			expect(money.toString())
				.toEqual("-$12.34");
		});

		it("formats thousands separators", () => {
			const money = new Money("1234.56", Currency.USD);
			expect(money.toString())
				.toEqual("$1,234.56");
		});

		it("throws on NaN", () => {
			const money = new Money("12.34");
			// Shouldn't be possible to hit this, but to be sure
			Object.defineProperty(money, "amount", {
				get: () => Number.NaN
			});
			expect(() => money.toString())
				.toThrow("Money amount is not a number");
		});
	});
});
