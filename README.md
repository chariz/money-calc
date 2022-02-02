<h2 align="center">
<img src="https://github.githubassets.com/images/icons/emoji/unicode/1f4b5.png">
<br>
money-calc
</h2>

**Helper class for calculating money amounts without rounding errors.**

## Installation

```bash
npm install --save money-calc
# or
yarn install money-calc
# or
pnpm install money-calc
```

## Usage
### MoneyAmount
A string of the format `1234.56`. Two decimal places **must** be provided. For example: `12.00` or `12.30`, rather than `12`, `12.0`, or `12.3`. Numbers only - no digit separators or currency symbols! The TypeScript type definition will help ensure your inputs are of the right format.

### MoneyInput
A money input can be represented as:

* A string matching the format of [MoneyAmount](#moneyamount).
* The exact string `0`, as a shortcut for `0.00`.
* An instance of [js-big-decimal](https://www.npmjs.com/package/js-big-decimal).
* An instance of the [Decimal128](https://mongodb.github.io/node-mongodb-native/4.1/classes/Decimal128.html) type, as exported by [bson](https://www.npmjs.com/package/bson) (the same type is also re-exported by the [MongoDB driver](https://www.npmjs.com/package/mongodb)). In MongoDB, this is called [NumberDecimal](https://docs.mongodb.com/manual/core/shell-types/#numberdecimal), meaning you can store a NumberDecimal in a MongoDB document, then retrieve and pass it directly to Money.
* You can also pass another instance of Money, or the simplified object returned by [`Money.toJSON()`](#tojson).

### Currency
Enumeration of all three-letter currency symbols that account for at least 1% of world trade, according to [xe.com](https://www.xe.com/popularity.php). Any other currency supported by ICU (the source of truth used by the [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) classes) will work, however.

### ComparisonResult
An enumeration of possible outcomes from a numeric comparison:

* `ComparisonResult.Ascending = -1`: The first number is less than the second number.
* `ComparisonResult.Same = 0`: The two numbers are equal.
* `ComparisonResult.Descending = 1`: The first number is greater than the second number.

### Money

Money objects are immutable, and are designed to be used in a chainable sequence of operations.

#### `new Money(amount: MoneyInput, currency?: Currency)`
Initialise a new Money instance with the supplied [MoneyInput](#moneyinput).

If a currency is not specified, and the amount isn’t an instance of Money, it will fall back to the default of USD.

Throws `TypeError` if the input amount is invalid.

#### `add(...amounts: MoneyInput[]): Money`
Returns an instance of Money with the result of adding the supplied amounts in sequence.

#### `subtract(...amounts: MoneyInput[]): Money`
Returns an instance of Money with the result of subtracting the supplied amounts in sequence.

#### `mul(...amounts: MoneyInput[]): Money`
Returns an instance of Money with the result of multiplying by the supplied amounts in sequence.

#### `div(...amounts: MoneyInput[]): Money`
Returns an instance of Money with the result of dividing by the supplied amounts in sequence.

#### `mod(...amounts: MoneyInput[]): Money`
Returns an instance of Money with the result of the modulus (division remainder) of the supplied amounts in sequence.

#### `percent(amount: MoneyInput): Money`
Returns an instance of Money with the result of multiplying by a percentage between `0.00` and `100.00`. This is effectively a shortcut for dividing the input amount by `100.00` before multiplying by that amount. If the percentage is between `0.00` and `1.00`, use [`mul()`](#mulamounts-moneyinput-money) instead.

#### `negate(): Money`
Returns an instance of Money with the amount negated - that is, a positive number becomes negative, and a negative number becomes positive.

#### `cmp(amount: MoneyInput): ComparisonResult`
Compares the amount with another amount, and returns the result of the comparison.

#### `toString(): string`
Formats the money amount for display in a user interface. Includes the appropriate currency sign for the supplied currency, in addition to thousand separators. For a machine-readable string, use [`amount`](#amount-string).

#### `toJSON(): { amount: MoneyAmount; currency: Currency }`
Returns an object that can be used to represent the Money in a JSON object. You can then initialise an instance of Money on the client side by using this as a `MoneyInput`, or directly pass these parameters to the number formatting mechanism for the platform.

#### `amount: string`
The string value that can be stored in a database or serialized into a payload such as JSON. This amount is rounded to 2 decimal places, and is intended to be machine-readable. For a human-readable string, use [`toString()`](#tostring-string).

## Credits
<p align="center">
<a href="https://chariz.com/">
<img src="https://chariz.com/img/chariz-logo-head@3x.png" width="166" height="60">
</a>
</p>

Developed by [Chariz](https://chariz.com/):

* [Adam Demasi (@kirb)](https://github.com/kirb)
* [Aarnav Tale (@tale)](https://github.com/tale)

## License
Licensed under the Apache License, version 2.0. Refer to [LICENSE.md](https://github.com/chariz/express-flash/blob/main/LICENSE.md).
