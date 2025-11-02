<script setup lang="ts">
	import { computed, provide } from 'vue';
	import shared from './shared';
	import type * as Types from './types';

	// map each card layout to an orientation hint for downstream consumers
	const cardActionOrientationHints: Record<Types.CardLayout, Types.CardActionOrientationHint> = {
		classic: 'horizontal',
		form: 'horizontal',
		split: 'vertical',
		media: 'horizontal',
		compact: 'horizontal',
	};

	// define props
	const props = defineProps<{
		layout?: Types.CardLayout;
	}>();

	const layout = computed<Types.CardLayout>(() => props.layout ?? 'classic');

	const actionOrientationHint = computed(() => cardActionOrientationHints[layout.value]);

	// provide hint context to children
	provide(shared.contextProperties.actionOrientationHint, actionOrientationHint);
</script>

<template>
	<div
		class="card"
		role="presentation"
		:data-layout="layout"
	>
		<slot />
	</div>
</template>

<style scoped lang="scss">
	.card {
		display: grid;

		background-color: var(--pallete-color-surface);
		color: var(--pallete-color-text);
		border: 1px solid var(--pallete-color-border-muted);
		border-radius: 0.75rem;

		padding: 1rem;
		gap: 1rem;
		min-width: 250px;
		min-height: 250px;

		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;

		// card layouts

		&[data-layout='classic'] {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto 1fr auto;
			grid-template-areas:
				'card-title card-title'
				'card-content card-content'
				'card-action card-action';
		}

		&[data-layout='compact'] {
			grid-template-columns: 1fr 1fr auto;
			grid-template-rows: 1fr auto;
			grid-template-areas:
				'card-content card-content card-content'
				'card-action card-action card-title';
			padding: 0.75rem;
			gap: 0.5rem;
			min-width: 180px;
			min-height: 180px;
		}
	}
</style>
