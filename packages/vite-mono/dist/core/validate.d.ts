import z from 'zod';
export declare function validate<S extends z.ZodType>(o: unknown, type: S): o is z.infer<S>;
export declare function validateAsync<S extends z.ZodType>(o: unknown, type: S): Promise<boolean>;
