import z from 'zod';
interface JSONSchema extends z.ZodType<JSONValue> {
}
type JSONValue = string | number | boolean | null | {
    [key: string]: JSONValue;
} | JSONValue[];
declare const JSONSchema: JSONSchema;
export { JSONSchema };
