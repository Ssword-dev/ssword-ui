import { cvm, InferVariantPropsWithClass } from '@ssword/utils';
import { JSX, PropsWithChildren } from 'react';

export type SimpleCompositionPrimitiveComponentProps<
	S extends keyof JSX.IntrinsicElements,
	P,
	V extends ReturnType<typeof cvm>,
> = JSX.IntrinsicElements[S] & P & InferVariantPropsWithClass<V>;

export interface SimpleCompositionPrimitiveComponentDeclaration<
	S extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
	P = {},
	V extends ReturnType<typeof cvm> = ReturnType<typeof cvm>,
> {
	is: S;
	props: P;
	vm: V;
}

export type SimpleCompositionPrimitiveComponent<
	D extends SimpleCompositionPrimitiveComponentDeclaration,
> = React.ForwardRefExoticComponent<
	SimpleCompositionPrimitiveComponentProps<D['is'], D['props'], D['vm']> & { asChild: boolean }
>;
