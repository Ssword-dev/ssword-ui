import { format as sprintf } from 'node:util';
import chalk from 'chalk';

const logFormats = {
	info: chalk.blue('[INFO]:') + ' ' + '%s',
	warn: chalk.yellowBright.bgYellow('[WARN]:') + ' ' + chalk.yellow('%s'),
	error: chalk.redBright.bgRed('[ERROR]') + ' ' + chalk.red('%s'),
	fatal: chalk.redBright.bgRed('FATAL') + ' ' + chalk.red('%s'),
};

type LogLevel = keyof typeof logFormats;

class Logger {
	hasOnceWarnLogged: boolean;
	hasOnceErrorLogged: boolean;
	warnOnceCache: Set<string>;

	constructor() {
		this.warnOnceCache = new Set<string>();
		this.hasOnceWarnLogged = false;
		this.hasOnceErrorLogged = false;
	}

	hasWarned() {
		return this.hasOnceWarnLogged;
	}

	hasErrorLogged() {
		return this.hasOnceErrorLogged;
	}

	format(format: string, ...params: string[]) {
		return sprintf(format, ...params);
	}

	log(message: string, logLevel: LogLevel = 'info') {
		console.log(this.format(logFormats[logLevel], message));
	}

	info(...args: Parameters<typeof this.log>) {
		this.log(...args);
	}

	warn(message: string, logLevel: LogLevel = 'warn') {
		if (!this.hasOnceWarnLogged) {
			this.hasOnceWarnLogged = true;
		}

		console.warn(this.format(logFormats[logLevel], message));
	}

	warnOnce(message: string, logLevel: LogLevel = 'warn') {
		if (this.warnOnceCache.has(message + logLevel)) {
			return;
		}

		this.warn(message, logLevel);
		this.warnOnceCache.add(message + logLevel);
	}

	error(message: string, logLevel: LogLevel = 'error') {
		if (!this.hasOnceErrorLogged) {
			this.hasOnceErrorLogged = true;
		}

		console.error(this.format(logFormats[logLevel], message));
	}

	clearScreen() {
		console.clear();
	}
}

export default Logger;
