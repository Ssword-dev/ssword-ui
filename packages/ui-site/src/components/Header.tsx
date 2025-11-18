import Brand from './Brand';
import Link from 'next/link';

const routerLinks = [
	{
		label: 'Documentation',
		to: '/docs',
	},
	{
		label: 'Components',
		to: '/components',
	},
];

const hyperLinks = [
	{
		label: 'Github',
		to: 'https://github.com/Ssword-dev/ssword-ui',
	},
];

const Header = () => (
	<header className="grid-in-footer-section bg-background border-t border-border-muted/30 py-4">
		<div className="px-4 just justify-center text-center">
			<div className="flex flex-row">
				<div className="flex self-center px-4 py-2">
					<Brand />
				</div>

				<div className="flex-1" />

				<div className="flex self-end gap-6 h-full px-2 text-text-muted text-lg">
					{routerLinks.map((rl) => (
						<div className="px-4 py-2">
							<Link
								key={rl.label}
								href={rl.to}
								className="select-none hover:text-primary transition-colors"
							>
								{rl.label}
							</Link>
						</div>
					))}

					{hyperLinks.map((hl) => (
						<div className="px-4 py-2">
							<a
								href="#"
								className="select-none hover:text-primary transition-colors"
								onClick={() => window.open(hl.to, '_blank')}
							>
								{hl.label}
							</a>
						</div>
					))}
				</div>
			</div>
		</div>
	</header>
);

export default Header;
