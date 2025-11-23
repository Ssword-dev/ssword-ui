import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils-dom';
import { ComponentDeclaration, defineComponent, properties } from './utils';

const cardDescriptionVM = cvm('text-muted-foreground text-sm', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const CardDescriptionComponentDeclaration = {
	is: 'div',
	variantManager: cardDescriptionVM,
	properties: properties<{}>(),
	variantProps(props) {
		return [{}, props] as const;
	},
} satisfies ComponentDeclaration;

const CardDescription = defineComponent(CardDescriptionComponentDeclaration);

export default CardDescription;
