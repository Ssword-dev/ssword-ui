import type { ComparisonTable } from '../comparer';

function safeParseFloat(str: string): number | null {
	const result = parseFloat(str);
	return isNaN(result) ? null : result;
}

function safeStringToBigInt(str: string): bigint | null {
	try {
		const trimmed = str.trim();
		return /^-?\d+$/.test(trimmed) ? BigInt(trimmed) : null;
	} catch {
		return null;
	}
}

const looseComparisonTable: ComparisonTable = {
	string: {
		// String to number: parse the string as number
		number: (x, y) => safeParseFloat(x) === y,

		// String to bigint: parse the string as bigint
		bigint: (x, y) => {
			const parsed = safeStringToBigInt(x);
			return parsed !== null && parsed === y;
		},

		// String to boolean: common truthy/falsy string values
		boolean: (x, y) => {
			if (y === true) return x === 'true' || x === '1';
			if (y === false) return x === 'false' || x === '0' || x === '';
			return false;
		},

		// String to null/undefined: common representations
		object: (x, y) => y === null && (x === 'null' || x === ''),
		undefined: (x) => x === 'undefined' || x === '',
	},

	number: {
		// Number to string: parse the string back as number
		string: (x, y) => safeParseFloat(y) === x,

		// Number to bigint: only if integer and in safe range
		bigint: (x, y) => Number.isInteger(x) && BigInt(x) === y,

		// Number to boolean: 1/0 truthiness
		boolean: (x, y) => {
			if (y === true) return x === 1;
			if (y === false) return x === 0;
			return false;
		},

		// Number to null: null coerces to 0
		object: (x, y) => y === null && x === 0,
	},

	bigint: {
		// BigInt to string: parse string as bigint
		string: (x, y) => {
			const parsed = safeStringToBigInt(y);
			return parsed !== null && x === parsed;
		},

		// BigInt to number: only if number is integer
		number: (x, y) => Number.isInteger(y) && x === BigInt(y),

		// BigInt to boolean: 1n/0n truthiness
		boolean: (x, y) => {
			if (y === true) return x === 1n;
			if (y === false) return x === 0n;
			return false;
		},

		// BigInt to null: null coerces to 0n
		object: (x, y) => y === null && x === 0n,
	},

	boolean: {
		// Boolean to string: common string representations
		string: (x, y) => {
			if (x === true) return y === 'true' || y === '1';
			if (x === false) return y === 'false' || y === '0' || y === '';
			return false;
		},

		// Boolean to number: 1/0
		number: (x, y) => {
			if (x === true) return y === 1;
			if (x === false) return y === 0;
			return false;
		},

		// Boolean to bigint: 1n/0n
		bigint: (x, y) => {
			if (x === true) return y === 1n;
			if (x === false) return y === 0n;
			return false;
		},

		// Boolean to null: only false equals null
		object: (x, y) => y === null && x === false,
	},

	undefined: {
		// undefined equals null (JS behavior)
		object: (_, y) => y === null,
	},

	object: {
		// null equals undefined (classic JS behavior)
		undefined: (x, _) => x === null,

		// null to string: common representations
		string: (x, y) => x === null && (y === 'null' || y === ''),

		// null to number: coerces to 0
		number: (x, y) => x === null && y === 0,

		// null to bigint: coerces to 0n
		bigint: (x, y) => x === null && y === 0n,

		// null to boolean: coerces to false
		boolean: (x, y) => x === null && y === false,
	},
};

export default looseComparisonTable;
