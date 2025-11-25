import { cn, cvm } from '@ssword/utils-dom';
import { forwardRef } from 'react';
import { PropType, RefType, WithClass, WithVariants } from './types';

const base = 'div';

type ComponentBase = typeof base;

const boxVM = cvm('p-2', {
	variants: {
		// alignment of the box

		align: {
			start: 'self-start',
			end: 'self-end',
			center: 'self-center',
		},

		justify: {
			start: '[.flex-row>&]:ml-0 [.flex-col>&]:mt-0',
			end: '[.flex-row>&]:ml-auto [.flex-col>&]:mt-auto',
			center: '[.flex-row>&]:my-auto [.flex-col>&]:my-auto',
		},
	},
	defaultVariants: {
		align: 'start',
		justify: 'start',
	},
	compoundVariants: [],
});

interface BoxProps extends WithVariants<WithClass<PropType<ComponentBase>>, typeof boxVM> {}

/**
 * A design primitive. does not use an `asChild` since this is used
 * to represent a virtual box using the box model.
 */
const Box = forwardRef<RefType<ComponentBase>, BoxProps>((props, forwardedRef) => {
	const { align, justify, className, ...baseProps } = props;
	const Comp = base;
	return (
		<Comp
			{...baseProps}
			className={cn(boxVM({ align, justify }), className)}
			ref={forwardedRef}
		/>
	);
});

export default Box;
export type { BoxProps as Props };
