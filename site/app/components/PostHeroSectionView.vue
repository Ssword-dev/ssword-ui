<script setup lang="ts"></script>

<template>
	<div class="post-hero-section-view flex flex-col justify-center items-center"><slot /></div>
</template>

<style scoped>
	.post-hero-section-view {
		grid-area: view-panel;
	}
</style>
