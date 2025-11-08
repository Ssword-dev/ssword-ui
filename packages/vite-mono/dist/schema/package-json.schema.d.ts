import { z } from 'zod';
import { JSONSchema } from './json.schema';
type ExportFieldType = string | ExportFieldMap;
interface ExportFieldMap {
    [key: string]: ExportFieldType | ExportFieldMap;
}
export declare const PackageJSONSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    private: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodEnum<{
        module: "module";
        commonjs: "commonjs";
    }>>;
    description: z.ZodOptional<z.ZodString>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
    homepage: z.ZodOptional<z.ZodString>;
    repository: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        type: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        directory: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>>;
    bugs: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    license: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>>;
    contributors: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>>>;
    maintainers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>>>;
    main: z.ZodOptional<z.ZodString>;
    module: z.ZodOptional<z.ZodString>;
    browser: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
    types: z.ZodOptional<z.ZodString>;
    typings: z.ZodOptional<z.ZodString>;
    files: z.ZodOptional<z.ZodArray<z.ZodString>>;
    exports: z.ZodOptional<z.ZodUnion<readonly [z.ZodType<ExportFieldType, unknown, z.core.$ZodTypeInternals<ExportFieldType, unknown>>, z.ZodRecord<z.ZodString, z.ZodType<ExportFieldType, unknown, z.core.$ZodTypeInternals<ExportFieldType, unknown>>>]>>;
    bin: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>>;
    man: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
    dependencies: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    devDependencies: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    peerDependencies: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    optionalDependencies: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    bundledDependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    bundleDependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    workspaces: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodObject<{
        packages: z.ZodArray<z.ZodString>;
        nohoist: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>]>>;
}, z.core.$catchall<JSONSchema>>; /** allow arbitrary JSON values. */
export type PackageJSON = z.infer<typeof PackageJSONSchema>;
export {};
