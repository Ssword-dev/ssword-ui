import { defineComponent } from 'vue';
import Brand from './Brand';

const Header = defineComponent({
	setup() {
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
		return () => (
			<header class="grid-in-footer-section bg-background border-t border-border-muted/30 py-4">
				<div class="px-4 just justify-center text-center">
					<div class="flex flex-row">
						<div class="flex self-center px-4 py-2">
							<Brand />
						</div>

						<div class="flex-1" />

						<div class="flex self-end gap-6 h-full px-2 text-text-muted text-lg">
							{routerLinks.map((rl) => (
								<div class="px-4 py-2">
									<NuxtLink
										key={rl.label}
										to={rl.to}
										class="select-none hover:text-primary transition-colors"
									>
										{rl.label}
									</NuxtLink>
								</div>
							))}

							{hyperLinks.map((hl) => (
								<div class="px-4 py-2">
									<a
										href="#"
										class="select-none hover:text-primary transition-colors"
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
	},
});

export default Header;
