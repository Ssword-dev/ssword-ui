import { cvm } from '@ssword/utils-dom';
import { forwardRef } from 'react';
import { PropType, RefType, WithClass, WithVariants } from './types';

const base = 'div';

type ComponentBase = typeof base;

const cardDescriptionVM = cvm('text-muted-foreground text-sm', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface CardDescriptionProps
	extends WithVariants<WithClass<PropType<ComponentBase>>, typeof cardDescriptionVM> {}

const CardDescription = forwardRef<RefType<ComponentBase>, CardDescriptionProps>(
	(props, forwardedRef) => {
		const { ...intrinsicProps } = props;
		const Comp = base;

		return (
			<Comp
				{...intrinsicProps}
				ref={forwardedRef}
			/>
		);
	},
);

export default CardDescription;
