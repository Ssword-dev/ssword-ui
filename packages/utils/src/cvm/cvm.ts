import { Comparer } from '../comparer';
import type { ClassInput } from '../clsx';
import clsx from '../clsx';
import looseComparisonTable from './loose-comparison-table';

type GenericVariantConfig = Record<string, Record<string, ClassInput>>;

type DefaultVariantConfig<T extends GenericVariantConfig> = {
	[K in keyof T]: keyof T[K];
};

type CompountVariants<T extends GenericVariantConfig> = ({
	[K in keyof T]?: keyof T[K];
} & { class: ClassInput })[];

type VariantManagerConfig<T extends GenericVariantConfig> = {
	variants: T;

	defaultVariants: DefaultVariantConfig<T>;

	compoundVariants: CompountVariants<T>;
};

type VariantInput<T extends VariantManagerConfig<GenericVariantConfig>> = Partial<{
	[K in keyof T['variants']]: keyof T['variants'][K];
}>;

type VariantValues<T extends VariantManagerConfig<GenericVariantConfig>> = {
	[K in keyof T['variants']]: keyof T['variants'][K];
};

type VueProps = Record<string, { type: [StringConstructor, BooleanConstructor]; required: false }>;
type VuePropsWithClass = Record<string, { type: StringConstructor; required: false }> & {
	class: { type: StringConstructor; required: false };
};

type VariantManager<
	T extends VariantManagerConfig<GenericVariantConfig> = VariantManagerConfig<GenericVariantConfig>,
> = {
	(props: VariantInput<T>): string;
	vueProps(): VueProps;
	vuePropsWithClass(): VuePropsWithClass;
};

type InferVariantProps<V extends VariantManager> = Parameters<V>[0];

type InferVariantPropsWithClass<V extends VariantManager> = InferVariantProps<V> & {
	class?: string;
};

// TODO: make things more correct via _comparer.
const _comparer = new Comparer(looseComparisonTable);

function cvm<const T extends VariantManagerConfig<GenericVariantConfig>>(
	defaultClass: string,
	config: T,
): VariantManager<T> {
	// precompute all these values here.
	// accessing the symbol table (closure)
	// is faster than recomputing all of these.
	const variantNames = Object.keys(config.variants);

	const variantNameCount = variantNames.length;

	// we have to reserve one more slot so we can
	// store the default class input.
	const compountVariantCount = config.compoundVariants.length + (defaultClass ? 1 : 0);

	const totalPossibleClassInputs = variantNameCount + compountVariantCount;

	const vm: VariantManager<T> = (input: VariantInput<T>) => {
		const resolvedVariantValues: VariantValues<T> = Object.assign(
			Object.create(null),
			config.defaultVariants,
		) as unknown as VariantValues<T>;

		for (const variantProperty in input) {
			const variantValue = String(input[variantProperty]);

			if (!variantValue) {
				continue;
			}

			resolvedVariantValues[variantProperty] = variantValue;
		}

		// worst case scenario, we use all slots here.
		const classInputs = new Array(totalPossibleClassInputs);

		let i = 0;

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		defaultClass && (classInputs[i++] = defaultClass);

		// optim: use precomputed variant names array.
		for (const variantName of variantNames) {
			const variantValue = resolvedVariantValues[variantName as keyof VariantValues<T>] as string;
			const classInput = config.variants[variantName]![variantValue];

			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			classInput && (classInputs[i++] = classInput);
		}

		// compound variants
		for (const compoundVariant of config.compoundVariants) {
			let matched = true;

			for (const variantName in compoundVariant) {
				if (variantName === 'class') {
					continue;
				}

				if (resolvedVariantValues[variantName] !== compoundVariant[variantName]) {
					matched = false; // mark not matched.
					break; // stop scanning.
				}
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			matched && (classInputs[i++] = compoundVariant['class']);
		}

		// pass all the inputs to clsx.
		// clsx is heavily optimized for things like
		// this.
		// eslint-disable-next-line prefer-spread
		return clsx.apply(null, classInputs);
	};

	vm.vueProps = () =>
		Object.fromEntries(
			variantNames.map((name) => [
				name,
				{
					type: [String, Boolean],
					required: false,
				},
			]),
		);

	vm.vuePropsWithClass = () =>
		Object.fromEntries(
			[...variantNames, 'class'].map((name) => [
				name,
				{
					type: String,
					required: false,
				},
			]),
		) as VuePropsWithClass;
	return vm;
}

export default cvm;
export { type InferVariantProps, type InferVariantPropsWithClass };
