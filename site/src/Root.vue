<script setup lang="ts">
	import { RouterView } from 'vue-router';
	import ThemeProvider from './providers/ThemeProvider.vue';
</script>

<template>
	<!-- wrap in theme provider so the theme settings are always accessible anywhere. -->
	<ThemeProvider>
		<!-- forward all elements -->
		<RouterView />
	</ThemeProvider>
</template>

<style scoped></style>
