import { cvm } from '@ssword/utils-dom';
import { forwardRef } from 'react';
import { PropType, RefType, WithAsChild, WithClass, WithVariants } from './types';

const base = 'div';

type ComponentBase = typeof base;

const cardActionVM = cvm('col-start-2 row-span-2 row-start-1 self-start justify-self-end', {
	variants: {},
	defaultVariants: {
		size: 'lg',
	},
	compoundVariants: [],
});

interface CardActionProps
	extends WithVariants<WithClass<PropType<ComponentBase>>, typeof cardActionVM> {}

const CardAction = forwardRef<RefType<ComponentBase>, CardActionProps>((props, forwardedRef) => {
	const { ...baseProps } = props;
	const Comp = base;

	return <Comp {...baseProps} />;
});

export default CardAction;
