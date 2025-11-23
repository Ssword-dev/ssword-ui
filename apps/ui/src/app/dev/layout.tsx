import { notFound } from 'next/navigation';

export default function DevLayout({ children }: { children: React.ReactNode }) {
	// block access in production
	if (process.env.NODE_ENV === 'production') {
		notFound();
	}

	return children;
}
