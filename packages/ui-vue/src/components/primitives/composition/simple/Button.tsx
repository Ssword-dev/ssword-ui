import { defineComponent } from 'vue';
import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils';

const buttonVM = cvm(
	'inline-flex items-center transition-all duration-200 ease-in-out px-4 py-2 text-base rounded-md border border-border bg-primary text-text hover:bg-accent hover:border-accent-strong hover:cursor-pointer active:scale-105 active:bg-accent active:border-accent-strong',
	{
		variants: {
			variant: {
				glass: 'bg-transparent backdrop-blur-md',
				primary: 'bg-primary',
			},

			size: {
				sm: 'px-3 py-1.5 text-sm',
				md: 'px-4 py-2 text-base',
				lg: 'px-6 py-3 text-lg',
				xl: 'px-8 py-4 text-xl',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
		compoundVariants: [],
	},
);

export default defineComponent<InferVariantPropsWithClass<typeof buttonVM>>({
	name: 'ButtonPrimitive',
	setup(props, { slots, attrs }) {
		return () => (
			<button
				{...attrs}
				class={cn(buttonVM(props), attrs.class as string)}
			>
				{slots.default?.()}
			</button>
		);
	},

	props: buttonVM.vueProps(),
});
