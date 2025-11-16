// Activateable.tsx
import { ref, defineComponent, computed, onMounted } from 'vue';
import eventManager from '../../../../events';
import { slottable } from '../utils';
import { cn, cvm } from '@ssword/utils';

export interface ActivatableChangeEventMetadata {
	value: boolean;
}

export interface ActivatableProps {
	normallyOpen?: boolean;
	asChild?: boolean;
	onToggle?: ActivatableChangeEventHandler;
}

const activatableVM = cvm(
	cn(
		'inline-flex items-center justify-center',
		'px-2 py-1 text-sm font-medium',
		'text-text-muted bg-transparent',
		'rounded-md border border-transparent',
		'transition-all duration-150 ease-in-out',
		'hover:bg-surface-hover hover:text-text',
		'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
		'data-active:bg-surface-active',
		'data-active:text-accent-strong',
		'data-active:border-accent-strong',
		'data-active:scale-95',
	),
	{
		variants: {},
		defaultVariants: {},
		compoundVariants: [],
	},
);

export default defineComponent({
	name: 'Activatable',

	props: {
		normallyOpen: {
			type: Boolean,
			default: false,
		},

		asChild: {
			type: Boolean,
			default: false,
		},

		...activatableVM.vuePropsWithClass(),
	},

	// the event manager requires this.
	emits: {
		toggle: (value: { value: boolean }) => true,
		click: (event: PointerEvent) => true,
	},

	// setup method.
	setup(props, { attrs, slots, emit }) {
		const state = ref(props.normallyOpen);
		const isHydrating = ref(true);
		const isMounted = ref(false);

		// Detect hydration
		onMounted(() => {
			isMounted.value = true;
			// Hydration is complete after mount
			setTimeout(() => {
				isHydrating.value = false;
				console.log('✅ Hydration complete');
			}, 0);
		});

		const dispatcher = eventManager.getCurrentDispatcher();

		const CompRef = computed(() => slottable('button', props.asChild));

		console.log(CompRef);

		const toggle = () => {
			state.value = !state.value;
		};

		const handleClick = (evt: PointerEvent) => {
			const event = emit('toggle', {
				value: !state.value,
			});

			// the default for this event is to toggle the state.
			toggle();

			// also call the click listener via the event dispatcher.
			emit('click', evt);
		};

		return () => (
			<CompRef.value
				role="checkbox"
				{...attrs}
				data-active={state.value ? true : undefined}
				onClick={handleClick}
				class={cn(``, props.class)}
			>
				{slots.default?.()}
			</CompRef.value>
		);
	},
});
