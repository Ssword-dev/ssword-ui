import { forwardRef } from 'react';
import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils-dom';
import type { PropType, RefType, WithClass, WithVariants } from './types';

const base = 'span';
type BaseComponent = typeof base;

const cardTitleVM = cvm('leading-none font-semibold', {
	variants: {
		color: {
			primary: 'text-primary',
			secondary: 'text-secondary',
			danger: 'text-danger',
			warning: 'text-warning',
			success: 'text-success',
			info: 'text-info',
			muted: 'text-text-muted',
			default: 'text-text',
		},
		size: {
			xs: 'text-xs',
			sm: 'text-sm',
			md: 'text-md',
			base: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl',
			'3xl': 'text-3xl',
		},
	},
	defaultVariants: {
		color: 'default',
		size: 'lg',
	},
	compoundVariants: [],
});

interface CardTitleProps
	extends WithVariants<WithClass<PropType<BaseComponent>>, typeof cardTitleVM> {}

const CardTitle = forwardRef<RefType<BaseComponent>, CardTitleProps>(
	({ className, color, size, ...intrinsicProps }, forwardedRef) => {
		const Comp = base;

		return (
			<Comp
				{...intrinsicProps}
				ref={forwardedRef}
				className={cn(cardTitleVM({ color, size }), className)}
			/>
		);
	},
);

export default CardTitle;
