type Type =
	| 'string'
	| 'number'
	| 'boolean'
	| 'undefined'
	| 'symbol'
	| 'bigint'
	| 'function'
	| 'object';

type TypeFromString<T extends Type> = T extends 'string'
	? string
	: T extends 'number'
		? number
		: T extends 'boolean'
			? boolean
			: T extends 'undefined'
				? undefined
				: T extends 'symbol'
					? symbol
					: T extends 'bigint'
						? bigint
						: T extends 'function'
							? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
								Function
							: T extends 'object'
								? object | null // Note: includes null
								: never;

type _ComparisonTable = {
	[KX in Type]?: {
		[KY in Type]?: (x: TypeFromString<KX>, y: TypeFromString<KY>) => boolean;
	};
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ComparisonTable extends _ComparisonTable {}

class Comparer {
	private _table: ComparisonTable;

	constructor(table: ComparisonTable) {
		this._table = table;
	}

	compare(x: unknown, y: unknown) {
		const comparison = this._table[typeof x]?.[typeof y];

		if (comparison) {
			return comparison(x as never, y as never);
		}

		// fallback to strict equality.
		return x === y;
	}
}

export { Comparer };
export type { ComparisonTable };
