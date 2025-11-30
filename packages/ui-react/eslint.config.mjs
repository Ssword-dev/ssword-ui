import { createLibraryConfig } from '@workspace/eslint/config';

export default createLibraryConfig({
	config: {},
	configPresets: [],
	nx: {
		presets: ['flat/react', 'flat/react-base', 'flat/react-jsx', 'flat/react-typescript'],
	},
});
