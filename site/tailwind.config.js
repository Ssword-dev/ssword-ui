/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,jsx,ts,tsx,vue}',
		'./pages/**/*.{js,jsx,ts,tsx,vue}',
		'./components/**/*.{js,jsx,ts,tsx,vue}',
		'./styles/**/*.css',
		'../packages/ui-vue/src/**/*.{js,jsx,tsx,css,vue}',
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
