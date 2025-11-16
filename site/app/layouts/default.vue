<script setup lang="ts">
	import Header from '@/components/Header';
	import Footer from '@/components/Footer';
</script>

<template>
	<div class="flex flex-col">
		<Header />
		<main class="flex-1">
			<slot />
		</main>
		<Footer />
	</div>
</template>
