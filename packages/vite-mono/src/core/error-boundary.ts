import { PromiseOr } from './types';

type ErrorConstructor<T extends Error = Error> = { new (message: string): T };
type ErrorHandlerCallback<T extends Error = Error> = (error: T) => PromiseOr<number | void>;

class ErrorBoundary {
	static globalErrorBoundary: ErrorBoundary | null = null;

	defaultHandler: ErrorHandlerCallback<Error> | null;
	handlerMap: WeakMap<ErrorConstructor, ErrorHandlerCallback>;
	global: boolean;

	static ofGlobal() {
		if (!this.globalErrorBoundary) {
			this.globalErrorBoundary = new ErrorBoundary();
			this.globalErrorBoundary.global = true;
		}

		return this.globalErrorBoundary;
	}

	constructor() {
		this.handlerMap = new WeakMap();
		this.defaultHandler = null;
		this.global = false;
	}

	addHandler<T extends Error = Error>(
		errorConstructor: ErrorConstructor<T>,
		handler: ErrorHandlerCallback<T>,
	) {
		this.handlerMap.set(errorConstructor, handler as ErrorHandlerCallback);
	}

	setDefaultHandler(handler: ErrorHandlerCallback<Error>) {
		this.defaultHandler = handler;
	}

	async handleThrow(thrown: unknown) {
		if (!(thrown instanceof Error)) return;

		const handler = this.handlerMap.get(thrown.constructor as ErrorConstructor);

		// has a handler.
		if (handler) {
			const result = handler(thrown);
			if (result instanceof Promise) await result;
		} else if (this.defaultHandler) {
			const result = this.defaultHandler(thrown);
			if (result instanceof Promise) await result;
		} else {
			/* pass */
		}
	}

	async run(fn: () => PromiseOr<void>) {
		try {
			const result = fn();
			if (result instanceof Promise) await result;
		} catch (thrown) {
			await this.handleThrow(thrown);
		}
	}
}

export { ErrorBoundary };
