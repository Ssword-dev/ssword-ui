import { cvm, type InferVariantPropsWithClass, cn } from '@ssword/utils';
import { defineComponent } from 'vue';

const cardFooterVariant = cvm('flex items-center px-6 [.border-t]:pt-6', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const CardFooter = defineComponent<InferVariantPropsWithClass<typeof cardFooterVariant>>({
	name: 'CardHeader',

	props: cardFooterVariant.vuePropsWithClass(),

	setup({ class: className, ...props }, { slots, attrs }) {
		return () => (
			<div
				class={cn(cardFooterVariant(props), className)}
				role="presentation"
				{...attrs}
			>
				{slots.default?.()}
			</div>
		);
	},
});

export default CardFooter;
