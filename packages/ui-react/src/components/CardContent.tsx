import { cn, cvm } from '@ssword/utils-dom';
import { PropType, RefType, WithClass, WithVariants } from './types';
import { forwardRef } from 'react';

const base = 'div';

type ComponentBase = typeof base;

const cardContentVM = cvm(cn('px-6 flex-grow'), {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface CardContentProps
	extends WithVariants<WithClass<PropType<ComponentBase>>, typeof cardContentVM> {}

const CardContent = forwardRef<RefType<ComponentBase>, CardContentProps>((props, forwardedRef) => {
	const Comp = base;
	const { ...baseProps } = props;

	return (
		<Comp
			{...baseProps}
			ref={forwardedRef}
		/>
	);
});

export default CardContent;
export type { CardContentProps as Props };
