import { describe, expect, it, test } from 'vitest';
import useState from '../useState';
import { isReadonly, isRef } from 'vue';

describe('useState', () => {
	it('should correctly return a tuple of 2 values and have the correct 2 values in the tuple.', () => {
		const returnValue = useState(null);

		expect(returnValue).toHaveLength(2);
		expect(returnValue[0].value).toBe(null);
		expect(returnValue[1]).toBeTypeOf('function');
	});

	it('should have a mutable vue ref containing the provided values', () => {
		const [valueRef, _] = useState(null);

		expect(isRef(valueRef)).toBe(true);
		expect(!isReadonly(valueRef)).toBe(true);
		expect(valueRef.value).toBe(null);
	});

	it('should return a tuple with a setter function at index 1', () => {
		const [_, setValue] = useState(null);

		// expect setValue to be able to accept different actions.
		expect(() => setValue(null)).not.toThrow(Error);
		expect(() => setValue(() => null)).not.toThrow(Error);
	});

	describe('useState setter', () => {
		it('should be able to correctly set the value of the value ref when called with a value or factory action.', () => {
			const [activeRef, setActive] = useState(false);

			setActive(true); // toggle.

			expect(activeRef.value).toBe(true); // toggled.

			setActive((prev) => !prev); // toggle back.

			expect(activeRef.value).toBe(false); // toggled back.
		});
	});
});
