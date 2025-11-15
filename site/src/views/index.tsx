import { defineComponent, inject, ref, type Ref } from 'vue';
import themeStore from '@/stores/theme';
import PostHeroSection from '@/components/PostHeroSection.vue';
import PostHeroSectionView from '@/components/PostHeroSectionView.vue';
import PostHeroSectionSample from '@/components/PostHeroSectionSample.vue';
import GetStartedSectionView from '@/components/GetStartedSectionView.vue';
import GetStartedSectionSample from '@/components/GetStartedSectionSample.vue';
import {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardContent,
	Activatable,
	Button,
	Text,
	type ThemeSettings,
} from '@ssword-ui/vue';

import { scroll } from '@ssword/utils';

import {
	BoldIcon,
	ItalicIcon,
	StrikethroughIcon,
	RocketIcon,
	PaletteIcon,
	LightbulbIcon,
	SparklesIcon,
	LayoutIcon,
	AccessibilityIcon,
	GithubIcon,
	CheckIcon,
	BrushIcon,
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const features = [
	{
		icon: LayoutIcon,
		title: 'Composable',
		description:
			'Build complex interfaces from simple, reusable components that work together seamlessly.',
	},
	{
		icon: PaletteIcon,
		title: 'Theme-Aware',
		description:
			'Automatic dark/light mode support with customizable design tokens and consistent spacing.',
	},
	{
		icon: AccessibilityIcon,
		title: 'Accessible',
		description:
			'WCAG compliant components with proper ARIA labels and keyboard navigation built-in.',
	},
	{
		icon: SparklesIcon,
		title: 'Expressive',
		description: 'Rich set of components that are both functional and beautiful out of the box.',
	},
];

const postHeroSections = [
	{
		view: GetStartedSectionView,
		sample: GetStartedSectionSample,
		id: 'get-started',
	},
];

export default defineComponent({
	name: 'HomePage',
	render() {
		return <article class="flex flex-col"></article>;
	},
});
