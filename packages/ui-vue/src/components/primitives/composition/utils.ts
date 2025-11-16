import type { DefineComponent } from 'vue';
import type { JSX } from 'vue/jsx-runtime';
import Slot from '../utility/Slot';

interface CommonCompositionPrimitiveComponentProps {
	asChild?: boolean;
}

function slottable<const T extends keyof JSX.IntrinsicElements>(
	defaultTag: string,
	asChild: boolean,
): DefineComponent<JSX.IntrinsicElements[T]> {
	return (asChild ? Slot : defaultTag) as DefineComponent<JSX.IntrinsicElements[T]>;
}

export { slottable };
export type { CommonCompositionPrimitiveComponentProps };
