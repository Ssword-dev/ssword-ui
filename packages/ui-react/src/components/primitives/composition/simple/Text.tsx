import { cn, cvm, InferVariantPropsWithClass } from '@ssword/utils';
import { slottable } from '../utils';
import { SimpleCompositionPrimitiveComponent } from './types';
import { ComponentDeclaration, defineComponent, properties } from './utils';

const textVM = cvm('text-base font-normal text-foreground', {
	variants: {
		variant: {
			default: '',
			subtle: 'text-muted-foreground',
			muted: 'text-muted-foreground/80',
			destructive: 'text-destructive',
			success: 'text-success',
			warning: 'text-warning',
		},
		size: {
			xs: 'text-xs',
			sm: 'text-sm',
			base: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl',
			'3xl': 'text-3xl',
			'4xl': 'text-4xl',
			'5xl': 'text-5xl',
			'6xl': 'text-6xl',
			'7xl': 'text-7xl',
		},
		weight: {
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
			justify: 'text-justify',
		},
		leading: {
			none: 'leading-none',
			tight: 'leading-tight',
			normal: 'leading-normal',
			relaxed: 'leading-relaxed',
			loose: 'leading-loose',
		},
		tracking: {
			tighter: 'tracking-tighter',
			tight: 'tracking-tight',
			normal: 'tracking-normal',
			wide: 'tracking-wide',
			wider: 'tracking-wider',
		},
		transform: {
			normal: '',
			uppercase: 'uppercase',
			lowercase: 'lowercase',
			capitalize: 'capitalize',
		},
		wrap: {
			normal: '',
			nowrap: 'whitespace-nowrap',
			balance: 'text-balance',
			pretty: 'text-pretty',
		},
		decoration: {
			none: '',
			underline: 'underline',
			'line-through': 'line-through',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'base',
		weight: 'normal',
		alignment: 'left',
		leading: 'normal',
		tracking: 'normal',
		transform: 'normal',
		wrap: 'normal',
		decoration: 'none',
	},
	compoundVariants: [],
});

const TextComponentDeclaration = {
	variantManager: textVM,
	properties: properties<{}>(),
	variantProps(props: any) {
		const {
			variant,
			size,
			weight,
			align,
			leading,
			tracking,
			transform,
			wrap,
			decoration,
			...intrinsicProps
		} = props;

		return [
			{
				variant,
				size,
				weight,
				align,
				leading,
				tracking,
				transform,
				wrap,
				decoration,
			},
			intrinsicProps,
		] as const;
	},
	is: 'span',
	baseClassName: '',
} satisfies ComponentDeclaration;

const Text = defineComponent(TextComponentDeclaration);

export default Text;
