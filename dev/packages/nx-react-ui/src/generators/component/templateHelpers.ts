const createTemplateHelpers = () => {
	return {
		lines: (...args: (string | false)[]) => args.filter((line) => line !== false).join('\n'),
	};
};

export { createTemplateHelpers };
