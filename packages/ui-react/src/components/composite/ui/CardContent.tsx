import { cvm, cn, type InferVariantPropsWithClass } from '@ssword/utils';
import { defineComponent } from 'vue';

const cardContentVariant = cvm(cn('px-6 flex-grow'), {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const CardContent = defineComponent<InferVariantPropsWithClass<typeof cardContentVariant>>({
	name: 'CardContent',

	props: cardContentVariant.vuePropsWithClass(),

	setup({ class: className, ...props }, { slots, attrs }) {
		return () => (
			<div
				class={cn(cardContentVariant(props), className)}
				{...attrs}
			>
				{slots.default?.()}
			</div>
		);
	},
});

export default CardContent;
