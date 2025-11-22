import { cn, cvm, InferVariantProps, InferVariantPropsWithClass } from '@ssword/utils';
import React, { FC, forwardRef, ForwardRefExoticComponent, JSX, ReactNode, useMemo } from 'react';

interface WildcardComponent {
	(props: any): ReactNode;
}

type ComposableForwardRefComponent = ForwardRefExoticComponent<{ className?: string }>;

type ComponentBase = keyof JSX.IntrinsicElements | ComposableForwardRefComponent;

interface ComponentDeclaration<
	Base extends ComponentBase = ComponentBase,
	Props = {},
	VariantManager extends ReturnType<typeof cvm> = ReturnType<typeof cvm>,
> {
	variantManager: ReturnType<typeof cvm>;
	properties: Props;

	// a function to manually destructure the properties
	// for variant manager.
	variantProps: (props: any) => [InferVariantProps<VariantManager>, React.ComponentProps<Base>];
	is: Base;
}

export type ResolveInheritanceChainProps<Decl extends ComponentDeclaration> =
	Decl extends ComponentDeclaration<ComposableForwardRefComponent>
		? React.ComponentPropsWithoutRef<Decl['is']>
		: React.ComponentPropsWithoutRef<Decl['is']>;

export type ComponentProps<Decl extends ComponentDeclaration> = ResolveInheritanceChainProps<Decl> &
	Decl['properties'] &
	InferVariantPropsWithClass<Decl['variantManager']>;

export type ComponentRef<Decl extends ComponentDeclaration> =
	Decl['is'] extends keyof JSX.IntrinsicElements
		? Decl['is'] extends keyof HTMLElementTagNameMap
			? HTMLElementTagNameMap[Decl['is']]
			: never
		: Decl['is'] extends React.ForwardRefExoticComponent<any>
			? React.ComponentPropsWithRef<Decl['is']>['ref'] extends React.Ref<infer R>
				? R
				: any
			: any;

// Typescript helper function.
function properties<Props>() {
	return {} as unknown as Props;
}

type ForwardRef<T, P> = ForwardRefExoticComponent<
	React.PropsWithoutRef<P> & React.RefAttributes<T>
>;

/**
 * The type returned by `defineComponent`
 * @concept Component Inheritance
 * @description Component inheritance allows composition components
 * to inherit from other components.
 */
type DefineComponent<Decl extends ComponentDeclaration> = ForwardRef<
	ComponentRef<Decl>,
	ComponentProps<Decl>
>;

function defineComponent<Decl extends ComponentDeclaration>(
	declaration: Decl,
): DefineComponent<Decl> {
	const { is, variantProps: destructureVariantProps, variantManager } = declaration;

	return forwardRef(({ className = '', ...props }, forwardedRef) => {
		const Base = is as WildcardComponent;
		const [variantProps, intrinsicProps] = destructureVariantProps(props) as [any, any];
		return (
			<Base
				{...intrinsicProps}
				className={cn(variantManager(variantProps), className)}
				ref={forwardedRef}
			/>
		);
	}) as DefineComponent<Decl>;
}

export { defineComponent, properties };
export type { ComponentDeclaration };
