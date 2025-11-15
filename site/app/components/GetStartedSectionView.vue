<script setup lang="ts">
	import { CodeIcon } from 'lucide-vue-next';
	import { Card, CardContent, CardTitle, Button, CardFooter } from '@ssword-ui/vue';
</script>

<template>
	<Card class="h-full w-full mx-4 my-2">
		<CardTitle class="text-3xl font-bold text-text">Ready to Start Building?</CardTitle>
		<CardContent class="text-lg text-text-muted leading-relaxed">
			Get started with ssword-ui in minutes. Comprehensive documentation, TypeScript support, and
			easy customization await.
		</CardContent>
		<CardFooter class="flex flex-wrap gap-4 pt-4">
			<Button
				size="lg"
				class="bg-primary text-white px-6"
			>
				<CodeIcon class="w-4 h-4 mr-2" />
				Installation Guide
			</Button>
			<Button
				size="lg"
				class="border border-border-muted px-6 bg-transparent hover:bg-muted/30"
			>
				Component Docs
			</Button>
		</CardFooter>
	</Card>
</template>
