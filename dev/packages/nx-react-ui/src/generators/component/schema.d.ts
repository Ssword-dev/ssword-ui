export interface ComponentGeneratorSchema {
	components: string[];
	asChild?: boolean;
	variants?: boolean;
	forward?: boolean;
	project: string;
}
