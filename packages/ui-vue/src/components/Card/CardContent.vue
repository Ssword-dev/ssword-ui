<template>
	<div class="card-content">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
	.card-content {
		grid-area: card-content;
		border-radius: 0.5rem;
		background-color: var(--pallete-color-muted);
		border: 1px var(--pallete-color-border-muted) solid;

		padding-left: 0.75rem;
		padding-right: 0.75rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;

		/* text wrap */
		word-wrap: break-word;
		text-overflow: ellipsis;
	}
</style>
