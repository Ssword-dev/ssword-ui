import { cvm, InferVariantProps } from '@ssword/utils-dom';
import React from 'react';

type RefType<T> =
	T extends React.ForwardRefExoticComponent<{ ref: infer R }>
		? R
		: T extends React.FC<any>
			? any
			: T extends keyof HTMLElementTagNameMap
				? HTMLElementTagNameMap[T]
				: never;

type PropType<T> = T extends keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any>
	? React.ComponentProps<T>
	: never;

type WithClass<T> = T & { className?: string | undefined };

type WithVariants<T, V extends ReturnType<typeof cvm>> = T & InferVariantProps<V>;

type WithAsChild<T> = T & { asChild?: boolean | undefined };

export type { RefType, PropType, WithAsChild, WithClass, WithVariants };
