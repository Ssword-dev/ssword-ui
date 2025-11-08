import { PromiseOr } from './types';
type ErrorConstructor<T extends Error = Error> = {
    new (message: string): T;
};
type ErrorHandlerCallback<T extends Error = Error> = (error: T) => PromiseOr<number | void>;
declare class ErrorBoundary {
    static globalErrorBoundary: ErrorBoundary | null;
    defaultHandler: ErrorHandlerCallback<Error> | null;
    handlerMap: WeakMap<ErrorConstructor, ErrorHandlerCallback>;
    global: boolean;
    static ofGlobal(): ErrorBoundary;
    constructor();
    addHandler<T extends Error = Error>(errorConstructor: ErrorConstructor<T>, handler: ErrorHandlerCallback<T>): void;
    setDefaultHandler(handler: ErrorHandlerCallback<Error>): void;
    handleThrow(thrown: unknown): Promise<void>;
    run(fn: () => PromiseOr<void>): Promise<void>;
}
export { ErrorBoundary };
