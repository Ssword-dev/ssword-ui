import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils';
import { ComponentDeclaration, defineComponent, properties } from './utils';

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

const CardComponentDeclaration = {
	is: 'div',
	variantManager: cardVM,
	properties: properties<{}>(),
	variantProps(props) {
		const { borderAccent, transition, ...intrinsicProps } = props;
		return [{ borderAccent, transition }, intrinsicProps] as const;
	},
} satisfies ComponentDeclaration;
const Card = defineComponent(CardComponentDeclaration);

export default Card;
