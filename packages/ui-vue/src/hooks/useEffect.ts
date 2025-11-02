import { nextTick, watch, watchEffect, type Ref, type WatchEffect } from 'vue';

type OnCleanup = Parameters<WatchEffect>[0];
export type Destructor = () => void;
export type Effect = () => Destructor | void;
export type Dep = Ref<unknown> | (() => unknown);

function createWatcherEffect(fn: Effect) {
	return async (onCleanup: OnCleanup) => {
		await nextTick();
		const cleanupOrVoid = fn();

		onCleanup(async () => {
			await nextTick();
			if (cleanupOrVoid) cleanupOrVoid();
		});
	};
}

function useEffect(fn: Effect, deps?: Dep[]) {
	const watcherEffect = createWatcherEffect(fn);

	if (!deps) {
		watchEffect(watcherEffect, { flush: 'post' });
		return;
	}

	if (deps.length === 0) {
		watchEffect(watcherEffect, { flush: 'post' });
		return;
	}

	watch(deps, (nval, oval, onCleanup) => watcherEffect(onCleanup), { immediate: true });
}

export default useEffect;
