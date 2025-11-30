import { createContext, RefCallback, useContext } from 'react';

interface PortalContext {
	container: HTMLElement;
	setContainer: RefCallback<HTMLElement>;
}

const PortalContext = createContext<PortalContext | null>(null);

function usePortalContext() {
	const context = useContext(PortalContext);

	if (!context) {
		throw new Error('No Portal Context provider found in the anscestry tree.');
	}

	return context;
}

export { usePortalContext };
export type { PortalContext };
