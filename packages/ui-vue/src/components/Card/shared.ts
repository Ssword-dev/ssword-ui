import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { CardActionOrientationHint } from './types';

const shared = {
	contextProperties: {
		// term: context key
		actionOrientationHint: 'actionOrientation',
	},

	nullReferences: {
		defaultActionOrientationHintRef: computed(
			() => 'horizontal',
		) as ComputedRef<CardActionOrientationHint>,
	},
} as const;

// runtime exports
export default shared;
