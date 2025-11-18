import { Text } from '@ssword-ui/react;
import { FC } from 'react';

const Footer: FC = () => (
	<footer className="flex flex-col h-auto bg-background border-t border-border-muted/30 py-4">
		<div className="justify-self-center self-center">
			<Text
				class="text-text/80"
				size="sm"
				align="center"
			>
				Copyright (&copy;) 2025 ssword. All rights reserved.
			</Text>
		</div>
	</footer>
);

export default Footer;
