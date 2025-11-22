import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils';
import { ComponentDeclaration, defineComponent, properties } from './utils';

const cardHeaderVM = cvm(
	'@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
	{
		variants: {},
		defaultVariants: {},
		compoundVariants: [],
	},
);

const CardHeaderComponentDeclaration = {
	is: 'div',
	variantManager: cardHeaderVM,
	properties: properties<{
		role?: string;
	}>(),
	variantProps(props) {
		const { role = 'presentation', ...variantProps } = props;
		return [{ role }, variantProps] as const;
	},
} satisfies ComponentDeclaration;

const CardHeader = defineComponent(CardHeaderComponentDeclaration);

export default CardHeader;
