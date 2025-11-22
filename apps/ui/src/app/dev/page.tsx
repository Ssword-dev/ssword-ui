import { PropsWithChildren } from 'react';

export default function DevLandingPage() {
	return (
		<div className="p-6 bg-yellow-50 border-l-4 border-yellow-400">
			<div className="bg-yellow-100 p-3 rounded mb-4">
				<strong>🛠️ Development Tools</strong> - Only available in dev mode
			</div>
			<nav className="mb-6 flex gap-4">
				<a
					href="/dev"
					className="px-3 py-1 bg-blue-500 text-white rounded"
				>
					Dashboard
				</a>
				<a
					href="/dev/npm"
					className="px-3 py-1 bg-green-500 text-white rounded"
				>
					NPM
				</a>
				<a
					href="/dev/pnpm"
					className="px-3 py-1 bg-purple-500 text-white rounded"
				>
					PNPM
				</a>
				<a
					href="/dev/audit"
					className="px-3 py-1 bg-red-500 text-white rounded"
				>
					Audit
				</a>
			</nav>
		</div>
	);
}
