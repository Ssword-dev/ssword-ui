import PriorityQueue from 'tinyqueue';

interface Task {
	fn: () => void;
	priority: number;
	id: number;
}

interface Scheduler {
	schedule: (fn: () => void, priority: number) => void;
	drain(): void;
}

function createScheduler(): Scheduler {
	// array of tasks that is resolved
	// and will be reused by the scheduler
	// to reduce memory allocations under the
	// hood.
	const taskPool = new PriorityQueue<Task>([], (a, b) => a.id - b.id);

	// scheduled tasks that will get called
	// by the scheduler.
	const scheduledTasks = new PriorityQueue<Task>([], (a, b) => a.priority - b.priority);

	let nextId = 0;

	function createTask(fn: () => void, priority: number) {
		if (taskPool.length) {
			const pooledTask = taskPool.pop()!;

			pooledTask.fn = fn;
			pooledTask.priority = priority;

			return pooledTask;
		}

		return {
			fn,
			priority,
			id: nextId++,
		};
	}

	let draining = false; // initially we are not draining.
	const frameBudget = 1000 / 60;

	function scheduleDrainForLater() {
		requestAnimationFrame(() => drain());
	}

	function drain() {
		if (!draining) {
			draining = true;
		}

		const startTime = Date.now();

		while (scheduledTasks.length) {
			// check if we exceeded the frame budget
			const now = Date.now();

			if (now - startTime > frameBudget) {
				scheduleDrainForLater();
				return;
			}

			const task = scheduledTasks.pop()!;

			let result: unknown | Promise<unknown>;

			try {
				result = task.fn();
			} finally {
				// a promise was returned.
				if (result && typeof result === 'object' && 'then' in result) {
					const promise = result as Promise<unknown>;

					promise.then(() => {
						// when the task is fully done, reuse the
						// task.
						taskPool.push(task);
					});
				}

				// void, undefined, or any non promise value
				// was returned.
				else {
					taskPool.push(task);
				}
			}
		}

		draining = false;
	}

	function tryToScheduleDrain() {
		if (!draining) scheduleDrainForLater();
	}

	function schedule(fn: () => void, priority: number) {
		const task = createTask(fn, priority);

		scheduledTasks.push(task);

		tryToScheduleDrain();
	}

	return {
		drain: tryToScheduleDrain,
		schedule,
	};
}

const globalScheduler: Scheduler = createScheduler();

export { createScheduler, globalScheduler };
