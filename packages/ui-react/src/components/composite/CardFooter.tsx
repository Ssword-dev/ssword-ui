import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils-dom';
import { ComponentDeclaration, defineComponent, properties } from './utils';

const cardFooterVM = cvm('flex items-center px-6 [.border-t]:pt-6', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const CardFooterComponentDeclaration = {
	is: 'div',
	variantManager: cardFooterVM,
	properties: properties<{
		role?: string;
	}>(),
	variantProps(props) {
		const { role = 'presentation', ...variantProps } = props;
		return [{ role }, variantProps] as const;
	},
} satisfies ComponentDeclaration;

const CardFooter = defineComponent(CardFooterComponentDeclaration);

export default CardFooter;
