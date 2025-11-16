// CardAction

import Button from '../../primitives/composition/simple/Button';
import { cvm, type InferVariantPropsWithClass, cn } from '@ssword/utils';
import { defineComponent } from 'vue';

const cardActionVariant = cvm('col-start-2 row-span-2 row-start-1 self-start justify-self-end', {
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

const CardAction = defineComponent<InferVariantPropsWithClass<typeof cardActionVariant>>({
	name: 'CardAction',

	props: cardActionVariant.vuePropsWithClass(),

	setup({ class: className, ...props }, { slots, attrs }) {
		return () => (
			<Button
				class={cn(cardActionVariant(props), className)}
				{...attrs}
			>
				{slots.default?.()}
			</Button>
		);
	},
});

export default CardAction;
