import { twMerge } from 'tailwind-merge';
import type { ClassInput } from './clsx';
import clsx from './clsx';

function cn(...inputs: ClassInput[]) {
	return twMerge(clsx(...inputs));
}

export default cn;
