export interface ComponentGeneratorSchema {
	name: string;
	asChild?: boolean;
	variants?: boolean;
	forward?: boolean;
	project: string;
}
