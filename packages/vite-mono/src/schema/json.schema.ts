import z from 'zod';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface JSONSchema extends z.ZodType<JSONValue> {}

type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[];

const JSONSchema: JSONSchema = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.record(z.string(), JSONSchema),
		z.array(JSONSchema),
	]),
);

export { JSONSchema };
