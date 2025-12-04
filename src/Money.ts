import BigDecimal from "js-big-decimal";
import { Decimal128 } from "bson";
import { Currency } from "./Currency";
import { ComparisonResult } from "./ComparisonResult";

const RoundingModes = BigDecimal.RoundingModes;

/** A single digit. */
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * A string of the format `1234.56`. Two decimal places **must** be provided. For example: `12.00`
 * or `12.30`, rather than `12`, `12.0`, or `12.3`.
 *
 * Numbers only - no digit separators or currency symbols! The TypeScript type definition will help
 * ensure your inputs are of the right format.
 */
export type MoneyAmount = `${"" | "-"}${number}.${Digit}${Digit}`;

/** A JSON representation of a Money object. */
export interface MoneyJSON {
	/**
	 * The string value that can be stored in a database or serialized into a payload such as JSON.
	 * This amount is rounded to 2 decimal places, and is intended to be machine-readable.
	 */
	amount: MoneyAmount;

	/** The currency of the amount. */
	currency: Currency;
}

/**
 * A money input can be represented as:
 *
 * * A string matching the format of [MoneyAmount](#moneyamount).
 * * The exact string `0`, as a shortcut for `0.00`.
 * * An instance of [js-big-decimal](https://www.npmjs.com/package/js-big-decimal).
 * * An instance of the [Decimal128](https://mongodb.github.io/node-mongodb-native/4.1/classes/Decimal128.html)
 *   type, as exported by [bson](https://www.npmjs.com/package/bson) (the same type is also
 *   re-exported by the [MongoDB driver](https://www.npmjs.com/package/mongodb)). In MongoDB, this
 *   is called [NumberDecimal](https://docs.mongodb.com/manual/core/shell-types/#numberdecimal),
 *   meaning you can store a NumberDecimal in a MongoDB document, then retrieve and pass it
 *   directly to Money.
 * * You can also pass another instance of Money, or the simplified object returned by `Money.toJSON()`.
 */
export type MoneyInput = Money | MoneyAmount | "0" | MoneyJSON | BigDecimal | Decimal128;

/** One of the supported operations. */
type MoneyOperation = "add" | "subtract" | "multiply" | "divide" | "modulus";

/**
 * Represents a monetary amount in a specific currency.
 *
 * Money objects are immutable, and are designed to be used in a chainable sequence of operations.
 */
export default class Money {
	/** The currency of the amount. */
	readonly currency: Currency;

	private readonly value: BigDecimal;

	/**
	 * The string value that can be stored in a database or serialized into a payload such as JSON.
	 * This amount is rounded to 2 decimal places, and is intended to be machine-readable. For a
	 * human-readable string, use `toString()`.
	 */
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
				if ("value" in amount && amount.value !== undefined) {
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

	/**
	 * Initialise a new Money instance with the supplied input.
	 *
	 * If a currency is not specified, and the amount isn’t an instance of Money, it will fall back
	 * to the default of USD.
	 *
	 * @param amount The monetary amount to operate on.
	 * @param currency The currency of the amount.
	 * @throws TypeError if the input amount is invalid.
	 */
	constructor(amount: MoneyInput, currency?: Currency) {
		this.value = Money.getBigDecimalValue(amount);
		this.currency = currency ?? (amount as Money).currency ?? "USD";
	}

	/**
	 * Returns an instance of Money with the result of adding the supplied amounts in sequence.
	 *
	 * @param amounts The amounts to add.
	 * @returns A new Money instance with the result.
	 */
	add(...amounts: MoneyInput[]): Money {
		return this.performOperation("add", ...amounts);
	}

	/**
	 * Returns an instance of Money with the result of subtracting the supplied amounts in sequence.
	 *
	 * @param amounts The amounts to subtract.
	 * @returns A new Money instance with the result.
	 */
	subtract(...amounts: MoneyInput[]): Money {
		return this.performOperation("subtract", ...amounts);
	}

	/**
	 * Returns an instance of Money with the result of multiplying the supplied amounts in sequence.
	 *
	 * @param amounts The amounts to multiply.
	 * @returns A new Money instance with the result.
	 */
	mul(...amounts: MoneyInput[]): Money {
		return this.performOperation("multiply", ...amounts);
	}

	/**
	 * Returns an instance of Money with the result of dividing by the supplied amounts in sequence.
	 *
	 * @param amounts The amounts to divide.
	 * @returns A new Money instance with the result.
	 */
	div(...amounts: MoneyInput[]): Money {
		return this.performOperation("divide", ...amounts);
	}

	/**
	 * Returns an instance of Money with the result of the modulus (division remainder) of the supplied amount.
	 *
	 * @param amount The amount to use as the modulus.
	 * @returns A new Money instance with the result.
	 * @throws TypeError if either amount is not an integer value.
	 */
	mod(amount: MoneyInput): Money {
		const modulus = new Money(amount);
		if (!this.amount.endsWith(".00") || !modulus.amount.endsWith(".00")) {
			throw new TypeError("Modulus of non-integers not supported");
		}
		const value = this.value
			.round(0, RoundingModes.HALF_EVEN)
			.modulus(modulus.value.round(0, RoundingModes.HALF_EVEN));
		return new Money(value, this.currency);
	}

	/**
	 * Returns an instance of Money with the result of multiplying by a percentage between `0.00` and
	 * `100.00`. This is effectively a shortcut for dividing the input amount by `100.00` before
	 * multiplying by that amount.
	 *
	 * If the percentage is between `0.00` and `1.00`, use `mul()` instead.
	 *
	 * @param amount The percentage amount to multiply by.
	 * @returns A new Money instance with the result.
	 */
	percent(amount: MoneyInput): Money {
		const percent = Money.getBigDecimalValue(amount)
			.divide(new BigDecimal(100), 8);
		return this.performOperation("multiply", percent);
	}

	/**
	 * Returns an instance of Money with the amount negated - that is, a positive number becomes
	 * negative, and a negative number becomes positive.
	 *
	 * @returns A new Money instance with the result.
	 */
	negate(): Money {
		return new Money(this.value.negate(), this.currency);
	}

	/**
	 * Compares the amount with another amount, and returns the result of the comparison.
	 *
	 * @param amount The amount to compare against.
	 * @returns The result of the comparison.
	 */
	cmp(amount: MoneyInput): ComparisonResult {
		return this.value.compareTo(Money.getBigDecimalValue(amount));
	}

	/**
	 * Returns an object that can be used to represent the Money in a JSON object. You can then
	 * initialise an instance of Money on the client side by using this as a `MoneyInput`, or directly
	 * pass these parameters to the number formatting mechanism for the platform.
	 *
	 * `toJSON()` is called by `JSON.stringify()` to retrieve a variant of the object that can be
	 * represented in JSON. As such, you likely won’t need to call this directly.
	 *
	 * @returns An object with `amount` and `currency` properties.
	 */
	toJSON(): MoneyJSON {
		const { amount, currency } = this;
		return { amount, currency };
	}

	/**
	 * Formats the money amount for display in a user interface. Includes the appropriate currency sign
	 * for the supplied currency, in addition to thousand separators. For a machine-readable string, use
	 * `amount`.
	 *
	 * @returns A formatted string representation of the money amount.
	 * @throws TypeError if the money amount is not a valid number.
	 */
	toString(): string {
		const number = Number(this.amount);
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
		const method = BigDecimal.prototype[operation] as (input: BigDecimal) => BigDecimal;
		// Ignore the lint warning, because it somewhat follows what the docs say about when reduce
		// is acceptable.
		// eslint-disable-next-line unicorn/no-array-reduce
		const value = args.reduce(
			(value: BigDecimal, arg: MoneyInput) => method.call(value, Money.getBigDecimalValue(arg)),
			this.value
		);
		return new Money(value, this.currency);
	}
}
