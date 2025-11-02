<script lang="tsx" setup>
	defineProps<{ label: string }>();
</script>

<template>
	<span class="card-title">
		<template v-if="label">
			{{ label }}
		</template>

		<template v-else>
			<slot />
		</template>
	</span>
</template>

<style>
	.card-title {
		font-size: 1.5rem;
		font-weight: 600;
		grid-area: card-title;
		justify-self: center;
		align-self: center;
	}
</style>
