type ConditionalClassRecord = Record<string, boolean>;
type FalsyClass = null | undefined | false | '' | 0 | Record<string, false> | FalsyClass[];
type ClassInput = ConditionalClassRecord | string | number | FalsyClass | ClassInput[];

interface FalsyClassInputClsxOverloads {
	(): '';
	(input: FalsyClass): '';
	(inputs: FalsyClass[]): '';
	(...inputs: FalsyClass[]): '';
}

interface TruthyClassInputClsxOverloads {
	(input: ClassInput[]): string;
	(...inputs: ClassInput[]): string;
}

interface Clsx extends FalsyClassInputClsxOverloads, TruthyClassInputClsxOverloads {}

/* @__PURE__ */ function _clsx() {
	let totalClasses = 0;

	function count(input: ClassInput) {
		if (!input) return;

		// the v8 will optimize these typeof checks hopefully.
		if (typeof input === 'string' || typeof input === 'number') {
			totalClasses++;
		} else if (Array.isArray(input)) {
			for (let i = 0; i < input.length; i++) {
				count(input[i]);
			}
		} else {
			for (const k of Object.keys(input)) {
				if (k && input[k]) totalClasses++;
			}
		}
	}

	function populate(input: ClassInput) {
		if (!input) return;
		if (typeof input === 'string' || typeof input === 'number') {
			classNames[idx++] = input.toString(); // directly call toString.
		} else if (Array.isArray(input)) {
			for (let i = 0; i < input.length; i++) {
				populate(input[i]);
			}
		} else {
			for (const k in input) {
				if (k && input[k]) classNames[idx++] = k;
			}
		}
	}

	// optim: no need to convert `arguments` to an array.
	// hint: spread arguments still has some overhead because
	// it needs to convert the arguments to an array.
	for (let i = 0; i < arguments.length; i++) {
		// eslint-disable-next-line prefer-rest-params
		count(arguments[i]);
	}

	let idx = 0;
	const classNames = new Array(totalClasses);

	// optim: again, no need to convert arguments to
	// array. just iterate.
	// in modern v8, spread syntax is mostly equally performant,
	// but it has some cost still.
	for (let i = 0; i < arguments.length; i++) {
		// eslint-disable-next-line prefer-rest-params
		populate(arguments[i]);
	}

	return classNames.join(' ');
}

const clsx = _clsx as Clsx;

export default clsx;
export type { ClassInput };
