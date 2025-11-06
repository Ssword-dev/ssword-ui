import z from 'zod';

export function validate<S extends z.ZodType>(o: unknown, type: S): o is z.infer<S> {
	return type.safeParse(o).success;
}

export async function validateAsync<S extends z.ZodType>(o: unknown, type: S): o is z.infer<S> {
	return (await type.safeParseAsync(o)).success;
}
