import { Slot } from '@radix-ui/react-slot';
import type { ForwardRefExoticComponent, JSX, ReactNode } from 'react';

interface CommonCompositionPrimitiveComponentProps {
	asChild?: boolean;
}

type Slottable<T extends keyof JSX.IntrinsicElements> = ForwardRefExoticComponent<
	JSX.IntrinsicElements[T]
>;

function slottable<const T extends keyof React.JSX.IntrinsicElements>(
	defaultTag: T,
	asChild: boolean,
): Slottable<T> {
	return (asChild ? Slot : defaultTag) as unknown as Slottable<T>;
}

export { slottable };
export type { CommonCompositionPrimitiveComponentProps };
