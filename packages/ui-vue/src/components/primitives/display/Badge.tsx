import { defineComponent } from 'vue';
import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils';

const badgeVM = cvm('inline px-2 py-1', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

export default defineComponent<InferVariantPropsWithClass<typeof badgeVM>>({
	name: 'BadgePrimitive',

	setup(props, { slots, attrs }) {
		return () => (
			<button
				{...attrs}
				class={cn(badgeVM(props), props.class)}
			>
				{slots.default?.()}
			</button>
		);
	},

	props: badgeVM.vuePropsWithClass(),
});
