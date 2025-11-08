// classic yargs.
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// commands
import build from './build';

// other utility subsystems.
import Logger from '../core/logger';
import { ErrorBoundary } from '../core';

// errors
import SchemaValidationError from '../error/schema-validation-error';

async function main() {
	const thisErrorBoundary = ErrorBoundary.ofGlobal();
	const logger = Logger.ofGlobal();

	thisErrorBoundary.setDefaultHandler((error) => {
		logger.error(`A fatal error has occured.\n${error.message}`, 'fatal');
	});

	thisErrorBoundary.addHandler(SchemaValidationError, (error) => {
		logger.error(
			`An validation error has occured. this may happen when a configuration file does not match expectations.\n${error.message}`,
		);
	});

	// run the program safely.
	// the errors are handled via the error boundary.
	// so it will not bubble up to here.
	await thisErrorBoundary.run(async () => {
		await yargs(hideBin(process.argv))
			.command({
				command: build.name,
				describe: false,
				handler: build.handler.bind(build),
			})
			.demandCommand(1, 'You need at least one command before moving on')
			.help()
			.parseAsync();
	});
}

export { main };
