import { FC, PropsWithChildren } from 'react';

const PostHeroSectionView: FC<PropsWithChildren> = ({ children }) => (
	<div className="[grid-area:view-panel] post-hero-section-view flex flex-col justify-center items-center">
		{children}
	</div>
);

export default PostHeroSectionView;
