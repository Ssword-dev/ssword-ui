import { forwardRef } from 'react';
import { cn, cvm } from '@ssword/utils-dom';
import type { ClassProps, Props, RefType, VariantProps } from './types';
import Text from './Text';

const base = Text;
type BaseComponent = typeof base;

const cardTitleVM = cvm('leading-none font-semibold', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

interface CardTitleProps
	extends Props<BaseComponent>,
		ClassProps,
		VariantProps<typeof cardTitleVM> {}

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
export type { CardTitleProps as Props };
