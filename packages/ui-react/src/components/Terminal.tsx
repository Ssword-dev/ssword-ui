import React, { forwardRef } from 'react';

import { cn, cvm, InferVariantPropsWithClass } from '@ssword/utils-dom';

// component configuration

// component inheritance base
const base = 'div';

// component variant manager
const terminalVM = cvm('', {
	variants: {},
	defaultVariants: {},
	compoundVariants: [],
});

// type alias for typeof base
type BaseComponent = typeof base;

interface TerminalProps
	extends React.ComponentProps<BaseComponent>,
		InferVariantPropsWithClass<typeof terminalVM> {
	/* props here */
}

const Terminal = forwardRef(({ className, ...props }: TerminalProps, forwardedRef) => {
	const Comp = base;

	// split out children
	const { children, ...restProps } = props;

	// compute variant classes
	const classes = terminalVM(restProps);

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

export default Terminal;
