import BigDecimal from "js-big-decimal";
import { Decimal128 } from "bson";
import { Currency } from "./Currency";
import { ComparisonResult } from "./ComparisonResult";

const RoundingModes = BigDecimal.RoundingModes;

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type MoneyAmount = `${"" | "-"}${number}.${Digit}${Digit}`;

type MoneyInput = Money | MoneyAmount | "0" | BigDecimal | Decimal128;
type MoneyOperation = "add" | "subtract" | "multiply" | "divide" | "modulus";

export default class Money {
	readonly currency: Currency;
	private readonly value: BigDecimal;

	get amount(): MoneyAmount {
		return this.value.round(2, RoundingModes.HALF_EVEN)
			.getValue() as MoneyAmount;
	}

	private static getBigDecimalValue(amount: MoneyInput): BigDecimal {
		// MoneyAmount - just return the string.
		// noinspection SuspiciousTypeOfGuard
		if (typeof amount === "string") {
			return new BigDecimal(amount);
		} else if (typeof amount === "object" && amount !== null) {
			// BigDecimal - return a copy of what we got in. Not really compliant to MoneyAmount because
			// it could have more decimal places than two, but still acceptable.
			if (amount instanceof BigDecimal) {
				return new BigDecimal(amount.getValue());
			}
			// Money - return a copy of the BigDecimal value if this is a full Money object, otherwise
			// it is a JSON object, which will only have the rounded string amount.
			if ("amount" in amount) {
				if (amount.value !== undefined) {
					return new BigDecimal(amount.value.getValue());
				}
				return new BigDecimal(amount.amount);
			}
			// Decimal128 - a Mongo NumberDecimal. Transform to string.
			if ("_bsontype" in amount && amount._bsontype === "Decimal128") {
				return new BigDecimal(amount.toString());
			}
		}
		throw new TypeError("Invalid MoneyInput type");
	}

	constructor(amount: MoneyInput, currency?: Currency) {
		this.value = Money.getBigDecimalValue(amount);
		this.currency = currency ?? (amount as Money).currency ?? "USD";
	}

	add(...amounts: MoneyInput[]): Money {
		return this.performOperation("add", ...amounts);
	}

	subtract(...amounts: MoneyInput[]): Money {
		return this.performOperation("subtract", ...amounts);
	}

	mul(...amounts: MoneyInput[]): Money {
		return this.performOperation("multiply", ...amounts);
	}

	div(...amounts: MoneyInput[]): Money {
		return this.performOperation("divide", ...amounts);
	}

	mod(amount: MoneyInput): Money {
		let modulus = new Money(amount);
		if (!this.amount.endsWith(".00") || !modulus.amount.endsWith(".00")) {
			throw new TypeError("Modulus of non-integers not supported");
		}
		let value = this.value
			.round(0, RoundingModes.HALF_EVEN)
			.modulus(modulus.value.round(0, RoundingModes.HALF_EVEN));
		return new Money(value, this.currency);
	}

	percent(amount: MoneyInput): Money {
		let percent = Money.getBigDecimalValue(amount)
			.divide(new BigDecimal(100), 8);
		return this.performOperation("multiply", percent);
	}

	negate(): Money {
		return new Money(this.value.negate(), this.currency);
	}

	cmp(amount: MoneyInput): ComparisonResult {
		return this.value.compareTo(Money.getBigDecimalValue(amount));
	}

	toJSON(): { amount: MoneyAmount; currency: Currency } {
		let { amount, currency } = this;
		return { amount, currency };
	}

	toString(): string {
		let number = Number(this.amount);
		if (Number.isNaN(number)) {
			throw new TypeError("Money amount is not a number");
		}
		return number.toLocaleString("en-US", {
			style: "currency",
			currency: this.currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}

	private performOperation(operation: MoneyOperation, ...args: MoneyInput[]): Money {
		let method = BigDecimal.prototype[operation] as (input: BigDecimal) => BigDecimal;
		// Ignore the lint warning, because it somewhat follows what the docs say about when reduce
		// is acceptable.
		// eslint-disable-next-line unicorn/no-array-reduce
		let value = args.reduce(
			(value: BigDecimal, arg: MoneyInput) => method.call(value, Money.getBigDecimalValue(arg)),
			this.value
		);
		return new Money(value, this.currency);
	}
}
