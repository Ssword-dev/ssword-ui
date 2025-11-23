import { cn, cvm, InferVariantProps, InferVariantPropsWithClass } from '@ssword/utils-dom';
import React, {
	FC,
	forwardRef,
	ForwardRefExoticComponent,
	JSX,
	ReactNode,
	ForwardRefRenderFunction,
} from 'react';

interface WildcardComponent {
	(props: any): ReactNode;
}

type IntrinsicComponent = keyof JSX.IntrinsicElements;

type ComposableForwardRefComponent = ForwardRefExoticComponent<{ className?: string }>;

type ComponentBase = IntrinsicComponent | ComposableForwardRefComponent;

interface ComponentDeclaration<
	Base extends ComponentBase = ComponentBase,
	Props = {},
	VariantManager extends ReturnType<typeof cvm> = ReturnType<typeof cvm>,
> {
	name?: string;
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

export type IntrinsicRef<Decl extends ComponentDeclaration<IntrinsicComponent>> =
	Decl extends ComponentDeclaration<infer Tag>
		? Tag extends keyof HTMLElementTagNameMap
			? HTMLElementTagNameMap[Tag]
			: never
		: never;

export type ComposableForwardRefComponentRef<
	Decl extends ComponentDeclaration<ComposableForwardRefComponent>,
> = React.ComponentPropsWithRef<Decl['is']> extends { ref: React.Ref<infer R> } ? R : any;

export type ComponentRef<Decl extends ComponentDeclaration> =
	Decl extends ComponentDeclaration<IntrinsicComponent>
		? IntrinsicRef<Decl>
		: Decl extends ComponentDeclaration<ComposableForwardRefComponent>
			? ComposableForwardRefComponentRef<Decl>
			: never;

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

	const render: ForwardRefRenderFunction<any, any> = (
		{ className = '', ...props }: ComponentProps<Decl>,
		forwardedRef,
	) => {
		const [variantProps, intrinsicProps] = destructureVariantProps(props) as [any, any];
		const Base: FC<any> = is as FC<any>;
		return (
			<Base
				{...intrinsicProps}
				className={cn(variantManager(variantProps), className)}
				ref={forwardedRef}
			/>
		);
	};

	const Comp: DefineComponent<Decl> = forwardRef(render);

	return Comp;
}

export { defineComponent, properties };
export type { ComponentDeclaration, DefineComponent };
