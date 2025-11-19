import { defineComponent } from 'vue';
import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils';

const skeletonVM = cvm('skeleton animate-skeleton-pulse', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

export default defineComponent<InferVariantPropsWithClass<typeof skeletonVM>>({
	name: 'SkeletonPrimitive',

	setup(props, { slots, attrs }) {
		return () => (
			<div
				{...attrs}
				class={cn(skeletonVM(props), props.class)}
			>
				{slots.default?.()}
			</div>
		);
	},

	props: skeletonVM.vuePropsWithClass(),
});
