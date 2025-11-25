import { cn, cvm } from '@ssword/utils-dom';
import { forwardRef } from 'react';
import { PropType, RefType, WithAsChild, WithClass, WithVariants } from './types';
import { Slot } from '@radix-ui/react-slot';

const base = 'span';

type ComponentBase = typeof base;

const badgeVM = cvm('inline-flex px-2 py-1 text-text', {
	variants: {
		variant: {
			default: '',
			primary: 'bg-primary',
			secondary: 'bg-secondary',
			info: 'bg-info',
			warn: 'bg-warn',
			destructive: 'bg-destructive',
		},
	},
	defaultVariants: {},
	compoundVariants: [],
});

interface BadgeProps
	extends WithVariants<WithAsChild<WithClass<PropType<ComponentBase>>>, typeof badgeVM> {}

/**
 * A non-interactable indicator that looks like a badge.
 */
const Badge = forwardRef<RefType<ComponentBase>, BadgeProps>((props, forwardedRef) => {
	const { variant, className, asChild, ...baseProps } = props;
	const Comp = asChild ? Slot : base;

	return (
		<Comp
			{...baseProps}
			className={cn(badgeVM({ variant }), className)}
			ref={forwardedRef}
		/>
	);
});

Badge.displayName = 'Badge';

export default Badge;
export type { BadgeProps as Props };
