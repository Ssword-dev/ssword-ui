import { cn, cvm, InferVariantProps, InferVariantPropsWithClass } from '@ssword/utils-dom';
import { forwardRef, JSX, ReactNode, useMemo } from 'react';
import { slottable } from '../utils';

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
	baseClassName: string;
}

export type ComponentProps<Decl extends ComponentDeclaration> = JSX.IntrinsicElements[Decl['is']] &
	Decl['properties'] &
	InferVariantPropsWithClass<Decl['variantManager']> & { asChild?: boolean };

// Typescript helper function.
function properties<Props>() {
	return {} as unknown as Props;
}

function defineComponent<Decl extends ComponentDeclaration>(declaration: Decl) {
	const {
		baseClassName,
		is: Base,
		variantProps: destructureVariantProps,
		variantManager,
	} = declaration;

	return forwardRef(
		({ asChild = false, className = '', ...props }: ComponentProps<Decl>, forwardedRef) => {
			const Comp = useMemo(() => slottable(Base, asChild), [asChild]) as WildcardComponent;
			const [variantProps, intrinsicProps] = destructureVariantProps(props);
			return (
				<Comp
					{...intrinsicProps}
					className={cn(baseClassName, variantManager(variantProps), className)}
					ref={forwardedRef}
				/>
			);
		},
	);
}

export { defineComponent, properties };
export type { ComponentDeclaration };
