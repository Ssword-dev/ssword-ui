import { cn, cvm, type InferVariantPropsWithClass } from '@ssword/utils';
import { type ComponentDeclaration, defineComponent, properties } from './utils';

const skeletonVM = cvm('skeleton animate-skeleton-pulse', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

const SkeletonComponentDeclaration = {
	is: 'span',
	variantManager: skeletonVM,
	properties: properties<{}>(),
	variantProps(props) {
		return [{}, props] as const;
	},
} satisfies ComponentDeclaration;

const Skeleton = defineComponent(SkeletonComponentDeclaration);

export default Skeleton;
