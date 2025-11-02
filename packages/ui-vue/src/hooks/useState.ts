import { ref, type Ref } from 'vue';

export type SetStateAction<T> = ((prev: T) => T) | T;
export type SetStateDispatch<T> = (newValueOrFactory: SetStateAction<T>) => void;
export type UseStateInitialValue<T> = (() => T) | T;

/**
 * @param initialValue The initial value.
 * @returns A tuple containing the value ref, and the setter.
 *
 * @remarks This function returns a Ref<T> because everything in vue that
 * needs reactivity must be wrapped in a ref or reactive proxy. some weird
 * quirk of implementing useState in vue.
 */
function useState<T>(initialValue: UseStateInitialValue<T>): [Ref<T>, SetStateDispatch<T>] {
	const valueRef = ref(
		typeof initialValue === 'function' ? (initialValue as CallableFunction)() : initialValue,
	);

	const setterDispatch: SetStateDispatch<T> = (newValueOrFactory) => {
		valueRef.value =
			// if it is a factory, then call it and provide the latest value.
			typeof newValueOrFactory === 'function'
				? (newValueOrFactory as CallableFunction)(valueRef.value)
				: // else, just treat it as value.
					newValueOrFactory;
	};

	return [valueRef, setterDispatch];
}

export default useState;
