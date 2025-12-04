/** Enumerates possible outcomes from a numeric comparison. */
export enum ComparisonResult {
	/** The first number is less than the second number. */
	Ascending = -1,

	/** The two numbers are equal. */
	Same = 0,

	/** The first number is greater than the second number. */
	Descending = 1
}
