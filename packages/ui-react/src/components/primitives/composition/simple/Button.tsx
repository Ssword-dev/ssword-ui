import { cn, cvm } from '@ssword/utils';
import { forwardRef } from 'react';

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

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'glass' | 'primary';
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => (
		<button
			ref={ref}
			{...props}
			className={cn(buttonVM({ variant, size }), className)}
		>
			{props.children}
		</button>
	),
);
