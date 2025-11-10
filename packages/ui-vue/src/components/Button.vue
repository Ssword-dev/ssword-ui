<script setup lang="ts">
	import { useAttrs } from 'vue';

	// attributes to forward.
	const attrs = useAttrs();
</script>

<template>
	<button
		class="inline-flex flex-row items-center button px-4 py-2 text-base rounded-md border text-text bg-primary border-border transition-all duration-200 ease-in-out hover:bg-accent hover:border-accent-strong hover:cursor-pointer active:scale-105 active:bg-accent active:border-accent-strong"
		v-bind="attrs"
	>
		<slot />
	</button>
</template>

<style lang="scss" scoped>
	// base button styles (idle)
	button {
		transition: all ease 0.2s;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 1rem;
		padding-right: 1rem;
		font-size: 1rem;
		color: var(--pallete-color-text);
		background-color: var(--pallete-color-primary);
		border-radius: 0.5rem;
		border: 1px var(--pallete-color-border) solid;

		// transition to preparing for user interaction.
		&:hover {
			transition: all ease 0.2s;
			background-color: var(--pallete-color-accent);
			border: 1px var(--pallete-color-accent-strong) solid;
			cursor: pointer;
		}

		// give user feedback. this usually gives
		// the users more serotonin.
		&:active {
			transition: all ease 0.2s;
			background-color: var(--pallete-color-accent);
			border: 1px var(--pallete-color-accent-strong) solid;
			transform: scale(1.05);
			box-shadow: none;
		}
	}
</style>
