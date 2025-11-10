<script setup lang="ts">
	import { RouterView } from 'vue-router';
	import ThemeProvider from './providers/ThemeProvider.vue';
</script>

<template>
	<ThemeProvider>
		<RouterView />
	</ThemeProvider>
</template>

<style scoped></style>
