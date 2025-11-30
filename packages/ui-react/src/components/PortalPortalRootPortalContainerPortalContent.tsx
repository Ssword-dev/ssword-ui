'use client';
import React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cn } from '@ssword/utils-dom';

import type { Props, ClassProps } from './types.ts';

const base = 'div';

type ComponentBase = typeof base;

interface PortalPortalRootPortalContainerPortalContentProps
	extends Props<ComponentBase>,
		ClassProps {}

const PortalPortalRootPortalContainerPortalContent = (
	props: PortalPortalRootPortalContainerPortalContentProps,
) => {
	const { className, ...restProps } = props;
	const Comp = base;
	return (
		<Comp
			{...restProps}
			className={cn(className)}
		>
			{props.children}
		</Comp>
	);
};

export default PortalPortalRootPortalContainerPortalContent;
export type { PortalPortalRootPortalContainerPortalContentProps as Props };
