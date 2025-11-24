import { cvm } from '@ssword/utils-dom';
import { PropType, RefType, WithClass, WithVariants } from './types';
import { forwardRef } from 'react';

const base = 'div';

type ComponentBase = typeof base;

const cardFooterVM = cvm('flex items-center px-6 [.border-t]:pt-6', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface CardFooterProps
	extends WithVariants<WithClass<PropType<ComponentBase>>, typeof cardFooterVM> {}

const CardFooter = forwardRef<RefType<ComponentBase>, CardFooterProps>((props, forwardedRef) => {
	const { ...intrinsicProps } = props;
	const Comp = base;

	return (
		<Comp
			{...intrinsicProps}
			ref={forwardedRef}
		/>
	);
});

export default CardFooter;
