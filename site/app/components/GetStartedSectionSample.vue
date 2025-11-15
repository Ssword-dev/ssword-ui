<script setup lang="ts">
	import { Card, CardContent } from '@ssword-ui/vue';
	import { RocketIcon } from 'lucide-vue-next';
</script>

<template>
	<Card class="p-4 h-full w-full">
		<CardContent class="m-4 h-full flex items-center justify-center">
			<div class="text-center space-y-4">
				<div
					class="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center"
				>
					<RocketIcon class="w-8 h-8 text-white" />
				</div>
				<h3 class="text-xl font-semibold text-text">Quick Start</h3>
				<code class="block bg-muted p-3 rounded text-sm font-mono text-text">
					npm install @ssword/ui-vue
				</code>
			</div>
		</CardContent>
	</Card>
</template>
