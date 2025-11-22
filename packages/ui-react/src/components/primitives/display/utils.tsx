import { cn, cvm, InferVariantProps, InferVariantPropsWithClass } from '@ssword/utils';
import { forwardRef, JSX, ReactNode, useMemo } from 'react';

interface WildcardComponent {
	(props: any): ReactNode;
}

interface ComponentDeclaration<
	Base extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
	Props = {},
	VariantManager extends ReturnType<typeof cvm> = ReturnType<typeof cvm>,
> {
	variantManager: ReturnType<typeof cvm>;
	properties: Props;

	// a function to manually destructure the properties
	// for variant manager.
	variantProps: (props: any) => [InferVariantProps<VariantManager>, JSX.IntrinsicElements[Base]];
	is: Base;
}

export type ComponentProps<Decl extends ComponentDeclaration> = JSX.IntrinsicElements[Decl['is']] &
	Decl['properties'] &
	InferVariantPropsWithClass<Decl['variantManager']>;

// Typescript helper function.
function properties<Props>() {
	return {} as unknown as Props;
}

function defineComponent<Decl extends ComponentDeclaration>(declaration: Decl) {
	const { is, variantProps: destructureVariantProps, variantManager } = declaration;

	return forwardRef(({ className = '', ...props }: ComponentProps<Decl>, forwardedRef) => {
		const [variantProps, intrinsicProps] = destructureVariantProps(props) as [any, any];
		const Base: string = is;
		return (
			<Base
				{...intrinsicProps}
				className={cn(variantManager(variantProps), className)}
				ref={forwardedRef}
			/>
		);
	});
}

export { defineComponent, properties };
export type { ComponentDeclaration };
