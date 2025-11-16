<script setup lang="ts">
	import './styles/tailwind.css';
	import { useNuxtApp } from '#app';
	import { theme } from '@ssword-ui/vue';

	useHeadSafe({
		link: [
			{
				href: '/themes/dark.css',
				rel: 'stylesheet',
			},
		],
	});
</script>

<template>
	<Body>
		<NuxtLayout>
			<LazyNuxtPage />
		</NuxtLayout>
		<NuxtRouteAnnouncer />
	</Body>
</template>
