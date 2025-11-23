import { FC, PropsWithChildren } from 'react';

const PostHeroSectionSample: FC<PropsWithChildren> = () => (
	<div className="[grid-area:sample-panel] flex flex-col justify-center items-center">
		<slot />
	</div>
);

export default PostHeroSectionSample;
