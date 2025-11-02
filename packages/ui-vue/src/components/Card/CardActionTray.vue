<script setup lang="ts">
	import { inject, type ComputedRef } from 'vue';
	import shared from './shared';
	import type * as Types from './types';

	// get injected orientation hint
	const orientationHint: ComputedRef<Types.CardActionOrientationHint> = inject(
		shared.contextProperties.actionOrientationHint,
		shared.nullReferences.defaultActionOrientationHintRef, // default: horizontal
	);
</script>

<template>
	<div
		class="card-action-tray rounded-md bg-transparent"
		:data-orientation="orientationHint"
		:class="{
			// horizontal orientation
			'flex flex-row flex-wrap items-center justify-start gap-[calc(1rem/3)]':
				orientationHint === 'horizontal',
			// vertical orientation
			'flex flex-col flex-wrap items-center justify-evenly gap-[calc(1rem/6)]':
				orientationHint === 'vertical',
		}"
	>
		<slot />
	</div>
</template>

<style scoped>
	.card-action-tray {
		grid-area: card-action;
	}
</style>
