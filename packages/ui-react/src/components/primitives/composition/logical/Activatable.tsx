import { useState, useEffect, useRef, type PointerEvent, forwardRef } from 'react';
import { cn, cvm } from '@ssword/utils';
import { Slot } from '@radix-ui/react-slot';

export interface ActivatableChangeEventMetadata {
	value: boolean;
}

export interface ActivatableProps extends Omit<React.ComponentProps<'button'>, 'onToggle'> {
	normallyOpen?: boolean;
	asChild?: boolean;
	onToggle?: (e: ActivatableChangeEventMetadata) => void;
	className?: string;
	children?: React.ReactNode;
}

const activatableVM = cvm(
	cn(
		'inline-flex items-center justify-center',
		'px-2 py-1 text-sm font-medium',
		'text-text-muted bg-transparent',
		'rounded-md border border-transparent',
		'transition-all duration-150 ease-in-out',
		'hover:bg-surface-hover hover:text-text',
		'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
		'data-active:bg-surface-active',
		'data-active:text-accent-strong',
		'data-active:border-accent-strong',
		'data-active:scale-95',
	),
	{
		variants: {},
		defaultVariants: {},
		compoundVariants: [],
	},
);

const Activatable = forwardRef<HTMLButtonElement, ActivatableProps>(
	({ normallyOpen = false, asChild = false, onToggle, className, children, ...rest }, ref) => {
		const [active, setActive] = useState(normallyOpen);
		const hydrating = useRef(true);

		useEffect(() => {
			const id = setTimeout(() => {
				hydrating.current = false;
			}, 0);
			return () => clearTimeout(id);
		}, []);

		const Comp = asChild ? Slot : 'button';

		const handleClick = (evt: PointerEvent<HTMLButtonElement>) => {
			const next = !active;
			onToggle?.({ value: next });
			setActive(next);
			rest.onClick?.(evt);
		};

		return (
			<Comp
				ref={ref}
				role="checkbox"
				data-active={active ? true : undefined}
				onClick={handleClick}
				className={cn(activatableVM({}), className)}
				{...rest}
			>
				{children}
			</Comp>
		);
	},
);

export default Activatable;
