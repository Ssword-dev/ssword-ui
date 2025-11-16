import { cvm, type InferVariantPropsWithClass, cn } from '@ssword/utils';
import { defineComponent } from 'vue';

const cardDescriptionVariant = cvm('text-muted-foreground text-sm', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const CardDescription = defineComponent<InferVariantPropsWithClass<typeof cardDescriptionVariant>>({
	name: 'CardDescription',

	props: cardDescriptionVariant.vuePropsWithClass(),

	setup({ class: className, ...props }, { slots, attrs }) {
		return () => (
			<div
				class={cn(cardDescriptionVariant(props), className)}
				{...attrs}
			>
				{slots.default?.()}
			</div>
		);
	},
});

export default CardDescription;
