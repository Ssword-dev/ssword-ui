<script setup lang="ts">
	import themeStore from '@/stores/theme';
	import PostHeroSection from '@/components/PostHeroSection.vue';
	import PostHeroSectionView from '@/components/PostHeroSectionView.vue';
	import PostHeroSectionSample from '@/components/PostHeroSectionSample.vue';
	import GetStartedSectionView from '@/components/GetStartedSectionView.vue';
	import GetStartedSectionSample from '@/components/GetStartedSectionSample.vue';
	import {
		Card,
		CardContent,
		CardTitle,
		CardActionTray,
		Activateable,
		Button,
		Skeleton,
		useEffect,
		scroll,
	} from '@ssword/ui-vue';
	import {
		BoldIcon,
		ItalicIcon,
		StrikethroughIcon,
		RocketIcon,
		PaletteIcon,
		LightbulbIcon,
		CodeIcon,
		SparklesIcon,
		LayoutIcon,
		AccessibilityIcon,
		GithubIcon,
		CheckIcon,
	} from 'lucide-vue-next';
	import { inject, ref, type Ref } from 'vue';
	import { RouterLink } from 'vue-router';

	const themeSettings = inject<ReturnType<typeof themeStore>>('theme-settings')!;

	// Interactive demo states
	const boldFlag = ref(false);
	const italicFlag = ref(false);
	const strikeThroughFlag = ref(false);
	const premiumFeature = ref(false);

	const stateToggler = (ref: Ref<boolean>) => () => (ref.value = !ref.value);
	const handleBoldFeatureToggle = stateToggler(boldFlag);
	const handleItalicFeatureToggle = stateToggler(italicFlag);
	const handleStrikeThroughFeatureToggle = stateToggler(strikeThroughFlag);
	const handlePremiumToggle = stateToggler(premiumFeature);

	const handleThemeToggle = () => {
		themeSettings.setTheme(themeSettings.mode === 'dark' ? 'light' : 'dark');
	};

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

	const footerLinks = [];

	const gotoGetStarted = () => scroll('#get-started');
	const viewOnGithub = () => window.open('https://github.com/your-username/ssword-ui', '_blank');
</script>

<template>
	<article class="home-page-article w-full h-full">
		<!-- Hero Section -->
		<section
			class="hero-section min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background text-text transition-all duration-500 px-4"
		>
			<div class="max-w-4xl text-center space-y-8">
				<!-- Main Title -->
				<div class="flex items-center justify-center gap-4 mb-6">
					<div class="relative">
						<PaletteIcon class="w-12 h-12 text-primary" />
						<div
							class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"
						></div>
					</div>
					<h1
						class="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
					>
						ssword-ui
					</h1>
				</div>

				<!-- Description -->
				<p class="text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
					A
					<span class="font-semibold text-primary">composable, expressive, and theme-aware</span>
					Vue UI library built for designers and developers alike. Focus on your ideas — not your
					boilerplate.
				</p>

				<!-- Action Buttons -->
				<div class="flex flex-col sm:flex-row justify-center gap-4 pt-6">
					<Button
						size="lg"
						class="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
						@click="gotoGetStarted"
					>
						<RocketIcon class="w-5 h-5 mr-2" />
						Get Started
					</Button>

					<Button
						size="lg"
						class="border-2 border-border-muted px-8 py-3 rounded-lg transition-all duration-300 hover:bg-muted/50"
						@click="viewOnGithub"
					>
						<GithubIcon class="w-5 h-5 mr-2" />
						View on GitHub
					</Button>

					<Button
						size="lg"
						class="px-6 py-3 rounded-lg transition-all duration-300 bg-transparent hover:bg-muted/30"
						@click="handleThemeToggle"
					>
						<LightbulbIcon
							class="w-5 h-5 mr-2"
							:class="themeSettings.mode === 'dark' ? 'text-yellow-400' : 'text-blue-400'"
						/>
						{{ themeSettings.mode === 'dark' ? 'Light' : 'Dark' }} Mode
					</Button>
				</div>
			</div>

			<!-- Interactive Demo Card -->
			<div class="w-full max-w-2xl mt-16 px-4">
				<!-- Demo Instructions -->
				<Card class="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
					<CardContent class="p-4 flex items-center gap-3">
						<SparklesIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
						<p class="text-blue-800 dark:text-blue-200 text-sm">
							Interactive demo - Try the controls below!
						</p>
					</CardContent>
				</Card>

				<Card class="shadow-2xl border border-border-muted/50 backdrop-blur-sm bg-background/80">
					<CardTitle
						label="Live Component Demo"
						class="flex items-center justify-between"
					>
						<Activateable
							@change="handlePremiumToggle"
							:class="{ 'bg-primary text-white': premiumFeature }"
							class="transition-colors duration-200 rounded-lg px-3 py-1 text-sm"
						>
							<span class="flex items-center gap-2">
								<CheckIcon
									v-if="premiumFeature"
									class="w-3 h-3"
								/>
								Premium Feature
							</span>
						</Activateable>
					</CardTitle>
					<CardContent class="space-y-4">
						<div
							:class="{
								'font-bold': boldFlag,
								italic: italicFlag,
								'line-through': strikeThroughFlag,
								'text-primary': premiumFeature,
							}"
							class="text-lg leading-relaxed transition-all duration-300"
						>
							<template v-if="premiumFeature">
								🚀 <strong>Premium Experience Activated!</strong> This demonstrates how ssword-ui
								components work together to create rich, interactive interfaces with smooth
								transitions and cohesive design language.
							</template>
							<template v-else>
								Empower your creativity with <code class="bg-muted px-1 rounded">ssword-ui</code>.
								From intuitive layouts to expressive components, it gives you everything you need to
								design refined, responsive, and accessible interfaces.
							</template>
						</div>

						<CardActionTray
							class="bg-muted/50 p-2 rounded-lg gap-1 [&>.activateable]:aspect-square"
						>
							<Activateable
								@change="handleBoldFeatureToggle"
								:class="{ 'bg-primary text-white': boldFlag }"
								class="transition-colors duration-200"
							>
								<BoldIcon class="w-4 h-4" />
							</Activateable>
							<Activateable
								@change="handleItalicFeatureToggle"
								:class="{ 'bg-primary text-white': italicFlag }"
								class="transition-colors duration-200"
							>
								<ItalicIcon class="w-4 h-4" />
							</Activateable>
							<Activateable
								@change="handleStrikeThroughFeatureToggle"
								:class="{ 'bg-primary text-white': strikeThroughFlag }"
								class="transition-colors duration-200"
							>
								<StrikethroughIcon class="w-4 h-4" />
							</Activateable>
							<div class="flex-1"></div>
							<div class="text-xs text-text-muted px-2 py-1 bg-white/50 dark:bg-black/30 rounded">
								{{
									[boldFlag && 'Bold', italicFlag && 'Italic', strikeThroughFlag && 'Strike']
										.filter(Boolean)
										.join(' • ') || 'Normal'
								}}
							</div>
						</CardActionTray>
					</CardContent>
				</Card>
			</div>
		</section>

		<!-- Features Section -->
		<section class="features-section py-20 bg-muted/20">
			<div class="max-w-6xl mx-auto px-4">
				<div class="text-center mb-16">
					<h2 class="text-3xl sm:text-4xl font-bold text-text mb-4">Why Choose ssword-ui?</h2>
					<p class="text-lg text-text-muted max-w-2xl mx-auto">
						Built with modern web standards and developer experience in mind
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<Card
						v-for="feature in features"
						:key="feature.title"
						class="text-center hover:shadow-lg transition-all duration-300 hover:translate-y-1 border-border-muted/30"
					>
						<CardContent class="p-6 space-y-4">
							<div
								class="w-12 h-12 mx-auto rounded-lg bg-muted/50 flex items-center justify-center"
							>
								<component
									:is="feature.icon"
									class="w-6 h-6 text-primary"
								/>
							</div>
							<h3 class="text-xl font-semibold text-text">{{ feature.title }}</h3>
							<p class="text-text-muted text-sm leading-relaxed">{{ feature.description }}</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>

		<template v-for="Section in postHeroSections">
			<PostHeroSection
				class="w-screen h-screen"
				:id="Section.id"
			>
				<PostHeroSectionView>
					<component :is="Section.view" />
				</PostHeroSectionView>
				<PostHeroSectionSample>
					<component :is="Section.sample" />
				</PostHeroSectionSample>
			</PostHeroSection>
		</template>

		<!-- Footer -->
		<section class="footer-section bg-background border-t border-border-muted/30 py-8">
			<div class="max-w-6xl mx-auto px-4 text-center">
				<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
					<div class="flex items-center gap-3">
						<PaletteIcon class="w-6 h-6 text-primary" />
						<span class="text-lg font-semibold text-text">ssword-ui</span>
					</div>
					<div class="flex gap-6 text-text-muted text-sm">
						<RouterLink
							to="/docs"
							class="hover:text-primary transition-colors"
							>Documentation</RouterLink
						>
						<RouterLink
							to="/components"
							class="hover:text-primary transition-colors"
							>Components</RouterLink
						>
						<a
							href="#"
							class="hover:text-primary transition-colors"
							@click="viewOnGithub"
							>GitHub</a
						>
					</div>
				</div>
				<p class="text-text-muted text-sm">
					Made with ❤️ using <code class="bg-muted px-1 rounded">@ssword/ui-vue</code> and Tailwind
					CSS
				</p>
			</div>
		</section>
	</article>
</template>

<style scoped>
	.hero-section {
		grid-area: hero-section;
	}

	.features-section {
		grid-area: features-section;
	}

	#get-started {
		grid-area: get-started;
	}

	.footer-section {
		grid-area: footer-section;
	}

	.home-page-article {
		display: grid;
		grid-template-areas:
			'hero-section'
			'features-section'
			'get-started'
			'footer-section';
	}

	/* Smooth transitions for all interactive elements */
	:deep(.activateable) {
		transition: all 0.2s ease-in-out;
	}

	:deep(.activateable:hover) {
		transform: scale(1.05);
	}
</style>
