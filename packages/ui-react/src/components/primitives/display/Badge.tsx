import { cvm } from '@ssword/utils-dom';
import { ComponentDeclaration, defineComponent, properties } from './utils';

const badgeVM = cvm('inline px-2 py-1', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const BadgeComponentDeclaration = {
	is: 'span',
	variantManager: badgeVM,
	properties: properties<{}>(),
	variantProps(props) {
		return [{}, props] as const;
	},
} satisfies ComponentDeclaration;

const Badge = defineComponent(BadgeComponentDeclaration);

export default Badge;
