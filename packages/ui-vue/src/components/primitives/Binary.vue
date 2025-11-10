<script lang="ts" setup>
	import { ref, useAttrs, type ButtonHTMLAttributes } from 'vue';
	import eventManager from '../../core/events';

	export interface BinaryChangeEventMetadata {
		value: boolean;
	}

	export type BinaryChangeEventHandler = (
		event: eventManager.SyntheticEvent<BinaryChangeEventMetadata>,
	) => void;

	export interface BinaryButtonProps
		extends /* @vue-ignore */ Omit<ButtonHTMLAttributes, 'onChange'> {
		normallyOpen?: boolean;
		onClick?: ButtonHTMLAttributes['onClick'];
		onChange?: BinaryChangeEventHandler;
	}

	const { normallyOpen = false } = defineProps<BinaryButtonProps>();

	const attrs = useAttrs();
	const state = ref(normallyOpen);
	const dispatcher = eventManager.getCurrentDispatcher();

	const toggle = () => {
		state.value = !state.value;
	};

	const handleClick = (evt: PointerEvent) => {
		const event = dispatcher.dispatch<BinaryChangeEventMetadata>('change', {
			value: !state.value, // new value after toggle.
		});

		// the default for this event is to toggle the state.
		if (!event.defaultPrevented) {
			toggle();
		}

		// also call the click listener via the
		// event dispatcher.
		dispatcher.dispatch('click', evt);
	};
</script>

<template>
	<button
		role="checkbox"
		v-bind="attrs"
		v-bind:data-active="state ? true : undefined"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
