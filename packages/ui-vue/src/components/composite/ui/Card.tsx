import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils';
import { defineComponent, type DefineComponent } from 'vue';

const cardVariant = cvm(
	'bg-surface text-text flex flex-col gap-6 rounded-xl border px-3 py-6 shadow-sm',
	{
		variants: {
			borderAccent: {
				none: '',
				primary: 'hover:border-primary',
				secondary: 'hover:border-secondary',
			},

			transition: {
				all: 'transition-all',
				colors: 'transition-colors',
				opacity: 'transition-opacity',
				shadow: 'transition-shadow',
				transform: 'transition-transform',
				none: '',
			},
		},
		defaultVariants: {
			borderAccent: 'none',
			transition: 'none',
		},
		compoundVariants: [],
	},
);

type CardProps = InferVariantPropsWithClass<typeof cardVariant>;

const Card: DefineComponent<CardProps> = defineComponent<CardProps>({
	name: 'Card',

	props: cardVariant.vuePropsWithClass(),

	setup({ class: className, ...props }, { slots, attrs }) {
		return () => (
			<div
				class={cn(cardVariant(props), className)}
				role="presentation"
				{...attrs}
			>
				{slots.default?.()}
			</div>
		);
	},
}) as DefineComponent<CardProps>;

export default Card;
export { type CardProps };
