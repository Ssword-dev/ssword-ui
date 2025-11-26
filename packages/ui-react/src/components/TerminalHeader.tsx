import React, { forwardRef } from 'react';

import { cn, cvm, InferVariantPropsWithClass } from '@ssword/utils-dom';

// component configuration

// component inheritance base
const base = 'div';

// component variant manager
const terminalHeaderVM = cvm('', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

// type alias for typeof base
type BaseComponent = typeof base;

interface TerminalHeaderProps
	extends React.ComponentProps<BaseComponent>,
		InferVariantPropsWithClass<typeof terminalHeaderVM> {
	/* props here */
}

const TerminalHeader = forwardRef(({ className, ...props }: TerminalHeaderProps, forwardedRef) => {
	const Comp = base;

	// split out children
	const { children, ...restProps } = props;

	// compute variant classes
	const classes = terminalHeaderVM(restProps);

	return (
		<Comp
			{...restProps}
			ref={forwardedRef}
			className={cn(classes, className)}
		>
			{props.children}
		</Comp>
	);
});

export default TerminalHeader;
