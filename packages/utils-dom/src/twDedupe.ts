import { twMerge } from 'tailwind-merge';

const dedupeCache: Record<string, string> = Object.create(null);

/**
 * A  specialized and cached version of twMerge.
 * @param classes The class string to tailwind dedupe.
 * @returns a deduped class string.
 */
function twDedupe(classes: string) {
	if (!dedupeCache[classes]) {
		dedupeCache[classes] = twMerge(classes);
	}

	return dedupeCache[classes];
}

export default twDedupe;
