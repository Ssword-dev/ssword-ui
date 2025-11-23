import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils-dom';
import { ComponentDeclaration, defineComponent, properties } from './utils';

const cardContentVM = cvm(cn('px-6 flex-grow'), {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const CardContentComponentDeclaration = {
	is: 'div',
	variantManager: cardContentVM,
	properties: properties<{}>(),
	variantProps(props) {
		return [{}, props] as const;
	},
} satisfies ComponentDeclaration;

const CardContent = defineComponent(CardContentComponentDeclaration);

export default CardContent;
