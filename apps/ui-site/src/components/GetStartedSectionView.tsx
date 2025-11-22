import { Card, CardContent } from '@ssword-ui/react';
import { RocketIcon } from 'lucide-react';
import type { FC } from 'react';

const GetStartedSectionView: FC = () => {
	return (
		<Card className="p-4 h-full w-full">
			<CardContent className="m-4 h-full flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center">
						<RocketIcon className="w-8 h-8 text-white" />
					</div>
					<h3 className="text-xl font-semibold text-text">Quick Start</h3>
					<code className="block bg-muted p-3 rounded text-sm font-mono text-text">
						npm install @ssword-ui/react
					</code>
				</div>
			</CardContent>
		</Card>
	);
};

export default GetStartedSectionView;
