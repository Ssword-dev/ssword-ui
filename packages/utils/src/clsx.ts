type ClassInput =
	| Record<string, boolean>
	| string
	| number
	| null
	| undefined
	| false
	| ClassInput[];

interface Clsx {
	(): string;
	(...inputs: ClassInput[]): string;
}

function _clsx() {
	let totalClasses = 0;

	function count(input: ClassInput) {
		if (!input) return;

		// the v8 will optimize these typeof checks hopefully.
		if (typeof input === 'string' || typeof input === 'number') {
			totalClasses++;
		} else if (Array.isArray(input)) {
			input.forEach(count);
		} else {
			for (const k in input) {
				// this is an optimization of
				// using raw boolean expression
				// instead of an if expression.
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				k && input[k] && totalClasses++;
			}
		}
	}

	function populate(input: ClassInput) {
		if (!input) return;
		if (typeof input === 'string' || typeof input === 'number') {
			classNames[idx++] = input.toString(); // directly call toString.
		} else if (Array.isArray(input)) {
			input.forEach(populate);
		} else {
			for (const k in input) {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				k && input[k] && (classNames[idx++] = k);
			}
		}
	}

	// optim: no need to convert `arguments` to an array.

	for (let i = 0; i < arguments.length; i++) {
		// eslint-disable-next-line prefer-rest-params
		count(arguments[i]);
	}

	let idx = 0;
	const classNames = new Array(totalClasses);

	// optim: again, no need to convert arguments to
	// array. just iterate.
	for (let i = 0; i < arguments.length; i++) {
		// eslint-disable-next-line prefer-rest-params
		populate(arguments[i]);
	}

	return classNames.join(' ');
}

const clsx = _clsx as Clsx;

export default clsx;
export type { ClassInput };
