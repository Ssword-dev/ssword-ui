import type { ClassInput } from './clsx';
import clsx from './clsx';
import twDedupe from './twDedupe';

function cn(...inputs: ClassInput[]): string {
	return twDedupe(clsx(...inputs));
}

export default cn;
