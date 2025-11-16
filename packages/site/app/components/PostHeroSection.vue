<script setup lang="ts">
	const props = withDefaults(defineProps<{ swap?: boolean }>(), {
		swap: false,
	});
</script>

<template>
	<section
		:data-layout="props.swap ? 'swapped' : 'normal'"
		:class="[
			'post-hero-section min-h-screen',
			'bg-background text-text transition-colors duration-500',
			'gap-6',

			// child styles
			'*:p-4',

			// default styles
			'[&>.post-hero-section-sample]:hidden',

			// medium above
			'md:[&>.post-hero-section-sample]:block',
		]"
	>
		<slot />
	</section>
</template>

<style lang="css" scoped>
	.post-hero-section {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
		grid-template-areas: 'view-panel';
	}

	@media screen and (width >= 48rem) {
		.post-hero-section {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr;
			grid-template-areas: 'view-panel sample-panel';
		}

		.post-hero-section[data-layout='swapped'] {
			grid-template-areas: 'sample-panel view-panel';
		}
	}
</style>
