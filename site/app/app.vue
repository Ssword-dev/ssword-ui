<script lang="ts">
	import './styles/tailwind.css';
	import Header from '@/components/Header';
	import Footer from '@/components/Footer';
</script>

<template>
	<NuxtLayout>
		<LazyNuxtPage />
	</NuxtLayout>
	<NuxtRouteAnnouncer />
</template>
