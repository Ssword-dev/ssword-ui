import { cvm, type InferVariantPropsWithClass, cn } from '@ssword/utils';
import { defineComponent } from 'vue';

const cardHeaderVariant = cvm(
	'@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
	{
		variants: {},
		defaultVariants: {},
		compoundVariants: [],
	},
);

const CardHeader = defineComponent<InferVariantPropsWithClass<typeof cardHeaderVariant>>({
	name: 'CardHeader',

	props: cardHeaderVariant.vuePropsWithClass(),

	setup({ class: className, ...props }, { slots, attrs }) {
		return () => (
			<div
				class={cn(cardHeaderVariant(props), className)}
				role="presentation"
				{...attrs}
			>
				{slots.default?.()}
			</div>
		);
	},
});

export default CardHeader;
