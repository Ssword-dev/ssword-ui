import { cvm } from '@ssword/utils-dom';
import { ComponentDeclaration, defineComponent, properties } from './utils';
import type { DefineComponent } from './utils';
const boxVM = cvm('inline p-2', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const BoxComponentDeclaration: ComponentDeclaration = {
	is: 'div',
	variantManager: boxVM,
	properties: properties<{}>(),
	variantProps(props) {
		return [{}, props] as const;
	},
};

const Box: DefineComponent<typeof BoxComponentDeclaration> =
	defineComponent(BoxComponentDeclaration);

export default Box;
