import { cvm, type InferVariantPropsWithClass, cn } from '@ssword/utils';
import { defineComponent } from 'vue';

const cardTitleVariant = cvm('leading-none font-semibold', {
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
		color: '',
		size: 'lg',
	},

	compoundVariants: [],
});

const CardTitle = defineComponent<InferVariantPropsWithClass<typeof cardTitleVariant>>({
	name: 'CardTitle',

	props: cardTitleVariant.vuePropsWithClass(),

	setup({ class: className, ...props }, { slots, attrs }) {
		return () => (
			<span
				class={cn(cardTitleVariant(props), className)}
				{...attrs}
			>
				{slots.default?.()}
			</span>
		);
	},
});

export default CardTitle;
