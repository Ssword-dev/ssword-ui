<script setup lang="ts">
	import themeStore from '@/stores/theme';
	import PostHeroSection from '@/components/PostHeroSection.vue';
	import PostHeroSectionView from '@/components/PostHeroSectionView.vue';
	import PostHeroSectionSample from '@/components/PostHeroSectionSample.vue';
	import {
		Card,
		CardContent,
		CardTitle,
		CardActionTray,
		Activateable,
		Button,
		Skeleton,
		useEffect,
	} from '@ssword/ui-vue';
	import {
		BoldIcon,
		ItalicIcon,
		StrikethroughIcon,
		RocketIcon,
		PaletteIcon,
		LightbulbIcon,
	} from 'lucide-vue-next';
	import { inject, ref, type Ref } from 'vue';

	const themeSettings = inject<ReturnType<typeof themeStore>>('theme-settings')!;

	// feature toggles for demo interactivity
	const boldFlag = ref(false);
	const italicFlag = ref(false);
	const strikeThroughFlag = ref(false);

	const stateToggler = (ref: Ref<boolean>) => () => (ref.value = !ref.value);
	const handleBoldFeatureToggle = stateToggler(boldFlag);
	const handleItalicFeatureToggle = stateToggler(italicFlag);
	const handleStrikeThroughFeatureToggle = stateToggler(strikeThroughFlag);

	const handleThemeToggle = () => {
		if (themeSettings.mode === 'dark') {
			themeSettings.setTheme('light');
		} else {
			themeSettings.setTheme('dark');
		}
	};
</script>

<template>
	<article class="home-page-article w-full h-full">
		<section
			class="hero-section min-h-screen flex flex-col items-center justify-center bg-background text-text transition-colors duration-500"
		>
			<!-- hero section -->
			<div class="max-w-3xl text-center space-y-6">
				<div class="flex items-center justify-center gap-3 mb-4">
					<PaletteIcon class="w-10 h-10 text-primary" />
					<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-primary">ssword-ui</h1>
				</div>

				<p class="text-lg text-text-muted">
					A composable, expressive, and theme-aware Vue UI library built for designers and
					developers alike. Focus on your ideas — not your boilerplate.
				</p>

				<div class="flex flex-row justify-center gap-4">
					<Button class="bg-primary mt-4">
						<RocketIcon class="inline-block w-4 h-4 mr-2" />
						Get Started
					</Button>

					<Button
						class="bg-primary mt-4"
						@click="handleThemeToggle"
					>
						<LightbulbIcon class="inline-block w-4 h-4 mr-2 stroke-secondary" />
						<template v-if="themeSettings.mode === 'dark'">Dark Mode </template>
						<template v-else>Light Mode </template>
					</Button>
				</div>
			</div>

			<!-- demo card -->
			<div class="w-full max-w-xl mt-16">
				<Card
					class="hero-frame-card shadow-lg border border-border-muted"
					layout="compact"
					id="demo-frame-card"
				>
					<CardTitle label="Interactive Card Demo" />
					<CardContent
						:class="{
							'font-bold': boldFlag,
							italic: italicFlag,
							'line-through': strikeThroughFlag,
						}"
						class="text-base text-text leading-relaxed transition-all duration-300"
					>
						Empower your creativity with <code>ssword-ui</code>. From intuitive layouts to
						expressive components, it gives you everything you need to design refined, responsive,
						and accessible interfaces — all without sacrificing developer productivity or visual
						harmony.
					</CardContent>

					<CardActionTray class="bg-muted px-1 py-1 gap-1 [&>.activateable]:aspect-square">
						<Activateable @change="handleBoldFeatureToggle">
							<BoldIcon class="w-4 h-4" />
						</Activateable>
						<Activateable @change="handleItalicFeatureToggle">
							<ItalicIcon class="w-4 h-4" />
						</Activateable>
						<Activateable @change="handleStrikeThroughFeatureToggle">
							<StrikethroughIcon class="w-4 h-4" />
						</Activateable>
					</CardActionTray>
				</Card>
			</div>
		</section>

		<!-- post-hero section -->
		<PostHeroSection id="post-hero-section-1">
			<PostHeroSectionView>
				<Skeleton class="h-full w-full animate-skeleton-pulse" />
			</PostHeroSectionView>
			<PostHeroSectionSample>
				<Skeleton class="h-full w-full animate-skeleton-pulse" />
			</PostHeroSectionSample>
		</PostHeroSection>

		<section class="footer-section">
			<!-- footer -->
			<footer class="mt-20 text-text-muted text-sm">
				<p>Crafted with ❤️ using <code>@ssword/ui-vue</code> and Tailwind v4</p>
			</footer>
		</section>
	</article>
</template>

<style scoped>
	.hero-section {
		grid-area: hero-section;
	}

	#post-hero-section-1 {
		grid-area: post-hero-section-1;
	}

	.footer-section {
		justify-self: center;
		grid-area: footer-section;
	}

	.home-page-article {
		display: grid;
		grid-auto-columns: 1fr;
		grid-template-rows:
			repeat(auto-fill, 1fr)
			auto;
		grid-template-areas:
			'hero-section'
			'post-hero-section-1'
			'footer-section';
	}
</style>
