/**
 * Enumeration of all three-letter currency symbols that account for at least 0.1% of daily volume,
 * according to [Wikipedia](https://en.wikipedia.org/wiki/Template:Most_traded_currencies). Any
 * other currency supported by ICU (the source of truth used by the
 * [Intl](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl) classes)
 * will work, however.
 */
export enum Currency {
	/** U.S. dollar */
	USD = "USD",
	/** Euro */
	EUR = "EUR",
	/** Japanese yen */
	JPY = "JPY",
	/** Pound sterling */
	GBP = "GBP",
	/** Renminbi */
	CNY = "CNY",
	/** Swiss franc */
	CHF = "CHF",
	/** Australian dollar */
	AUD = "AUD",
	/** Canadian dollar */
	CAD = "CAD",
	/** Hong Kong dollar */
	HKD = "HKD",
	/** Singapore dollar */
	SGD = "SGD",
	/** Indian rupee */
	INR = "INR",
	/** South Korean won */
	KRW = "KRW",
	/** Swedish krona */
	SEK = "SEK",
	/** Mexican peso */
	MXN = "MXN",
	/** New Zealand dollar */
	NZD = "NZD",
	/** Norwegian krone */
	NOK = "NOK",
	/** New Taiwan dollar */
	TWD = "TWD",
	/** Brazilian real */
	BRL = "BRL",
	/** South African rand */
	ZAR = "ZAR",
	/** Polish złoty */
	PLN = "PLN",
	/** Danish krone */
	DKK = "DKK",
	/** Indonesian rupiah */
	IDR = "IDR",
	/** Turkish lira */
	TRY = "TRY",
	/** Thai baht */
	THB = "THB",
	/** Israeli new shekel */
	ILS = "ILS",
	/** Hungarian forint */
	HUF = "HUF",
	/** Czech koruna */
	CZK = "CZK",
	/** Chilean peso */
	CLP = "CLP",
	/** Philippine peso */
	PHP = "PHP",
	/** Colombian peso */
	COP = "COP",
	/** Malaysian ringgit */
	MYR = "MYR",
	/** UAE dirham */
	AED = "AED",
	/** Saudi riyal */
	SAR = "SAR",
	/** Romanian leu */
	RON = "RON",
	/** Peruvian sol */
	PEN = "PEN"
}
