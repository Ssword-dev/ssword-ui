import { describe, it, expect, vi } from 'vitest';
import { ref, effectScope } from 'vue';
import useEffect from '../useEffect';

// thanks to https://stackoverflow.com/a/51045733/30127778
// i can actually wait up the promises used internally
// on my useEffect implementation.

function runAllPromises() {
	return new Promise((res) => setImmediate(res));
}

describe('useEffect', () => {
	it('runs effect asynchronously', async () => {
		const spy = vi.fn();

		const scope = effectScope();

		scope.run(() => {
			useEffect(spy, []);
		});

		// by the time this runs, the effect has been scheduled.
		// but is not actually ran. so this would have been called
		// 0 times in a real and test environment.
		expect(spy).toHaveBeenCalledTimes(0);

    // flush the mount effect promise.
		await runAllPromises();

    scope.stop();
	});

	it('runs immediately on mount', async () => {
		const spy = vi.fn();

		const scope = effectScope();

		scope.run(() => {
			useEffect(spy, []);
		});

    await runAllPromises();
		scope.stop();

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('runs again when dependency changes', async () => {
		const spy = vi.fn();
		const a = ref(1);

		const scope = effectScope();

		scope.run(() => {
			useEffect(spy, [a]);
		});

		a.value++;

		await runAllPromises();

		expect(spy).toHaveBeenCalledTimes(2);
		scope.stop();
	});

	it('calls cleanup before re-running', async () => {
		const cleanup = vi.fn();
		const a = ref(1);

		const scope = effectScope();
		scope.run(() => {
			useEffect(() => cleanup, [a]);
		});

		a.value++;
		await new Promise((res) => setImmediate(res));

		expect(cleanup).toHaveBeenCalledTimes(1);
		scope.stop();
	});

	it('does not run again if deps are unchanged', async () => {
		const spy = vi.fn();
		const a = ref(1);

		const scope = effectScope();
		scope.run(() => {
			useEffect(spy, [a]);
		});

		// setting same value should not trigger watch
		a.value = 1;
		await new Promise((res) => setImmediate(res));

		expect(spy).toHaveBeenCalledTimes(1);
		scope.stop();
	});

	it('runs cleanup on unmount', async () => {
		const cleanup = vi.fn();
		const a = ref(1);

		const scope = effectScope();
		scope.run(() => {
			useEffect(() => cleanup, [a]);
		});

    // 2 rounds of the event loop must be awaited in here
    // in before and after the scope unmounts.
    // the first is to run mounting effects,
    // the second is to run destructors.
    await runAllPromises();
		scope.stop(); // simulate component unmount
    await runAllPromises();

		// cleanup should have been called
		expect(cleanup).toHaveBeenCalledTimes(1);
	});
});
