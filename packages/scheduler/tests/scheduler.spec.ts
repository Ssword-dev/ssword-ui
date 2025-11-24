import { createScheduler } from '../src';

describe('index', () => {
	describe('createScheduler', () => {
		const scheduler = createScheduler();

		expect(scheduler).toBeTruthy();
		expect(scheduler.drain).toBeDefined();
		expect(scheduler.schedule).toBeDefined();
	});
});
