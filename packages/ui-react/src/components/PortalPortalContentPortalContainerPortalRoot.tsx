'use client';
import React, { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn } from '@ssword/utils-dom';

import type { RefType, Props, ClassProps } from './types.ts';

const base = 'div';

type ComponentBase = typeof base;

interface PortalPortalContentPortalContainerPortalRootProps
	extends Props<ComponentBase>,
		ClassProps {}

const PortalPortalContentPortalContainerPortalRoot = forwardRef<
	RefType<ComponentBase>,
	PortalPortalContentPortalContainerPortalRootProps
>((props: PortalPortalContentPortalContainerPortalRootProps, forwardedRef) => {
	const { className, ...restProps } = props;
	const Comp = base;
	return (
		<Comp
			{...restProps}
			ref={forwardedRef}
			className={cn(className)}
		>
			{props.children}
		</Comp>
	);
});

export default PortalPortalContentPortalContainerPortalRoot;
export type { PortalPortalContentPortalContainerPortalRootProps as Props };
