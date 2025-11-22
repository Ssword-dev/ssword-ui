import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils';
import { ComponentDeclaration, defineComponent, properties } from './utils';

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
		color: '',
		size: 'lg',
	},
	compoundVariants: [],
});

const CardTitleComponentDeclaration = {
	is: 'span',
	variantManager: cardTitleVM,
	properties: properties<{}>(),
	variantProps(props) {
		const { color, size } = props;
		return [{ color, size }, props] as const;
	},
} satisfies ComponentDeclaration;

const CardTitle = defineComponent(CardTitleComponentDeclaration);

export default CardTitle;
