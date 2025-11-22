import { cvm } from '@ssword/utils-dom';
import { ComponentDeclaration, defineComponent, properties } from './utils';

const boxVM = cvm('inline p-2', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const BoxComponentDeclaration = {
	is: 'div',
	variantManager: boxVM,
	properties: properties<{}>(),
	variantProps(props) {
		return [{}, props] as const;
	},
} satisfies ComponentDeclaration;

const Box = defineComponent(BadgeComponentDeclaration);

export default Badge;
