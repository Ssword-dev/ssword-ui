import { cvm } from '@ssword/utils-dom';
import { ComponentDeclaration, defineComponent, properties } from './utils';
import Button from '../primitives/composition/simple/Button';
import React from 'react';

const cardActionVM = cvm('col-start-2 row-span-2 row-start-1 self-start justify-self-end', {
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
		size: 'lg',
	},
	compoundVariants: [],
});

const CardActionComponentDeclaration = {
	is: Button,
	variantManager: cardActionVM,
	properties: properties<{}>(),
	variantProps(props) {
		const { color, size } = props;
		return [{ color, size }, props] as const;
	},
} satisfies ComponentDeclaration;

const CardAction = defineComponent(CardActionComponentDeclaration);

<CardAction variant="glass" />;
export default CardAction;
