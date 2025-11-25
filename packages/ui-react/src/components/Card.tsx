import { cn, cvm } from '@ssword/utils-dom';
import { forwardRef } from 'react';
import { PropType, RefType, WithClass, WithVariants } from './types';

const base = 'div';

type ComponentBase = typeof base;

const cardVM = cvm(
	'bg-surface text-text flex flex-col gap-6 rounded-xl border px-3 py-6 shadow-sm',
	{
		variants: {
			borderAccent: {
				none: '',
				primary: 'hover:border-primary',
				secondary: 'hover:border-secondary',
			},

			transition: {
				all: 'transition-all',
				colors: 'transition-colors',
				opacity: 'transition-opacity',
				shadow: 'transition-shadow',
				transform: 'transition-transform',
				none: '',
			},
		},
		defaultVariants: {
			borderAccent: 'none',
			transition: 'none',
		},
		compoundVariants: [],
	},
);

interface CardProps extends WithVariants<WithClass<PropType<ComponentBase>>, typeof cardVM> {}

const Card = forwardRef<RefType<ComponentBase>, CardProps>((props, forwardedRef) => {
	const Comp = base;
	const { borderAccent, transition, className, ...baseProps } = props;

	return (
		<Comp
			{...baseProps}
			className={cn(cardVM({ borderAccent, transition }), className)}
			ref={forwardedRef}
		/>
	);
});

export default Card;
export type { CardProps as Props };
