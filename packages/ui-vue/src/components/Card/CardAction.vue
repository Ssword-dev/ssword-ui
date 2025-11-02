<script setup lang="ts">
	import { useAttrs } from 'vue';
	import Button from '../Button.vue';

	const attrs = useAttrs();
</script>

<template>
	<Button
		class="card-action"
		v-bind="attrs"
	>
		<slot />
	</Button>
</template>

<style lang="scss" scoped>
	// base grid styles.
	.nova-card-action {
		display: inline;
		justify-self: center;
		align-self: center;
		grid-area: card-action;
	}
</style>
