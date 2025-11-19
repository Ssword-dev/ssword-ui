import { cn } from '@ssword/utils';
import { FC, PropsWithChildren } from 'react';

const PostHeroSection: FC<PropsWithChildren<{ swap?: boolean }>> = ({ children, swap = false }) => (
	<section
		data-layout={swap ? 'swapped' : 'normal'}
		className={cn([
			'post-hero-section min-h-screen',
			'bg-background text-text transition-colors duration-500',
			'gap-6',

			// child styles
			'*:p-4',

			// default styles
			'grid grid-cols-[1fr] grid-rows-[1fr] md:[grid-template-areas:"view-panel_sample-panel"] md:data-[layout="swapped"]:[grid-template-areas:"sample-panel_view-panel"] [&>.post-hero-section-sample]:hidden',

			// medium above
			'md:[&>.post-hero-section-sample]:block',
		])}
	>
		{children}
	</section>
);

export default PostHeroSection;
