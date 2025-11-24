import { cn, cvm } from '@ssword/utils-dom';
import { forwardRef } from 'react';
import { PropType, RefType, WithClass, WithVariants } from './types';

const base = 'div';

type ComponentBase = typeof base;

const boxVM = cvm('inline p-2', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface BoxProps extends WithVariants<WithClass<PropType<ComponentBase>>, typeof boxVM> {}

/**
 * A design primitive. does not use an `asChild` since this is used
 * to represent a virtual box using the box model.
 */
const Box = forwardRef<RefType<ComponentBase>, BoxProps>((props, forwardedRef) => {
	const { className, ...baseProps } = props;
	const Comp = base;
	return (
		<Comp
			{...baseProps}
			className={cn(boxVM({}), className)}
			ref={forwardedRef}
		/>
	);
});
export default Box;
