<script setup lang="ts">
	import { RouterView } from 'vue-router';
	import Header from '@/components/Header';
	import Footer from '@/components/Footer';
</script>

<template>
	<Header />
	<main class="h-full w-full overflow-x-hidden">
		<RouterView />
	</main>
	<Footer />
</template>
