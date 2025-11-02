<script lang="ts" setup>
	import Binary, { type BinaryButtonProps } from './primitives/Binary.vue';

	// define binary-like props
	const props = defineProps<BinaryButtonProps>();
</script>

<template>
	<Binary
		v-bind="props"
		class="activateable"
	>
		<slot />
	</Binary>
</template>

<style lang="scss" scoped>
	.activateable {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.5rem;
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--color-text-muted);
		border-radius: 0.375rem;
		border: 1px solid transparent;
		background: transparent;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			transform 0.1s ease;

		// when hovering, suggest interactivity without being loud
		&:hover {
			background-color: var(--color-surface-hover);
			color: var(--color-text);
		}

		// when toggled active
		&[data-active] {
			background-color: var(--color-surface-active);
			color: var(--color-accent-strong);
			border-color: var(--color-accent-strong);
			transform: scale(0.96);
		}

		// when focused via keyboard
		&:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}
	}
</style>
