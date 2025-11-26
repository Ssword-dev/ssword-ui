import React, { forwardRef } from 'react';

import { cn, cvm, InferVariantPropsWithClass } from '@ssword/utils-dom';

// component configuration

// component inheritance base
const base = 'div';

// component variant manager
const terminalOutputVM = cvm('', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

// type alias for typeof base
type BaseComponent = typeof base;

interface TerminalOutputProps
	extends React.ComponentProps<BaseComponent>,
		InferVariantPropsWithClass<typeof terminalOutputVM> {
	/* props here */
}

const TerminalOutput = forwardRef(({ className, ...props }: TerminalOutputProps, forwardedRef) => {
	const Comp = base;

	// split out children
	const { children, ...restProps } = props;

	// compute variant classes
	const classes = terminalOutputVM(restProps);

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

export default TerminalOutput;
