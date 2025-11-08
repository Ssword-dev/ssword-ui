declare const logFormats: {
    info: string;
    warn: string;
    error: string;
    fatal: string;
};
type LogLevel = keyof typeof logFormats;
declare class Logger {
    static globalLogger: Logger | null;
    hasOnceWarnLogged: boolean;
    hasOnceErrorLogged: boolean;
    warnOnceCache: Set<string>;
    global: boolean;
    static ofGlobal(): Logger;
    constructor();
    hasWarned(): boolean;
    hasErrorLogged(): boolean;
    format(format: string, ...params: string[]): string;
    log(message: string, logLevel?: LogLevel): void;
    info(...args: Parameters<typeof this.log>): void;
    warn(message: string, logLevel?: LogLevel): void;
    warnOnce(message: string, logLevel?: LogLevel): void;
    error(message: string, logLevel?: LogLevel): void;
    clearScreen(): void;
}
export default Logger;
