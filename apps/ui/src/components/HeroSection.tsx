import { scrollTo } from '@ssword/utils-dom';

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Activatable,
	CardFooter,
	Text,
	Services,
} from '@ssword-ui/react';
import {
	PaletteIcon,
	RocketIcon,
	GithubIcon,
	LightbulbIcon,
	SparklesIcon,
	CheckIcon,
	BoldIcon,
	ItalicIcon,
	StrikethroughIcon,
} from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';

function HeroSection() {
	// interactive demo states
	const [boldFlag, setBoldFlag] = useState(false);
	const [italicFlag, setItalicFlag] = useState(false);
	const [strikeThroughFlag, setStrikeThroughFlag] = useState(false);
	const [premiumFeature, setPremiumFeature] = useState(false);

	// theming
	const themeContext = Services.Theming.useTheme();

	// handlers
	const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () =>
		setter((s: boolean) => !s);
	const handleBoldFeatureToggle = useCallback(toggle(setBoldFlag), []);
	const handleItalicFeatureToggle = useCallback(toggle(setItalicFlag), []);
	const handleStrikeThroughFeatureToggle = useCallback(toggle(setStrikeThroughFlag), []);
	const handlePremiumToggle = useCallback(toggle(setPremiumFeature), []);
	const handleThemeToggle = useCallback(() => {
		themeContext.setThemeMode((m) => (m === 'dark' ? 'light' : 'dark'));
		// if you have a global theme provider, call it here instead
	}, []);
	const gotoGetStarted = useCallback(() => scrollTo('#get-started'), []);
	const viewOnGithub = useCallback(
		() => window.open('https://github.com/Ssword-dev/ssword-js', '_blank'),
		[],
	);

	const formatActiveFeatures = useMemo(() => {
		const activeFeatures = [
			boldFlag && 'Bold',
			italicFlag && 'Italic',
			strikeThroughFlag && 'Strike',
		].filter(Boolean);
		return (activeFeatures as string[]).join(' • ') || 'Normal';
	}, [boldFlag, italicFlag, strikeThroughFlag]);

	return (
		<section className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-background via-muted/20 to-background text-text transition-all duration-500 px-4">
			<div className="max-w-4xl text-center space-y-8">
				<div className="flex items-center justify-center gap-4 mb-6">
					<div className="relative">
						<PaletteIcon className="w-12 h-12 text-primary" />
						<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
					</div>

					<h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						ssword-ui
					</h1>
				</div>

				<p className="text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
					A{' '}
					<span className="font-semibold text-primary">
						composable, expressive, and theme-aware
					</span>{' '}
					Vue UI library built for designers and developers alike. Focus on your ideas — not your
					boilerplate.
				</p>

				<div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
					<Button
						size="lg"
						className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
						onClick={gotoGetStarted}
					>
						<RocketIcon className="w-5 h-5 mr-2" />
						<Text>Get Started</Text>
					</Button>

					<Button
						size="lg"
						className="border-2 border-border-muted px-8 py-3 rounded-lg transition-all duration-300 hover:bg-muted/50"
						onClick={viewOnGithub}
					>
						<GithubIcon className="w-5 h-5 mr-2" />
						View on GitHub
					</Button>

					<Button
						size="lg"
						className="px-6 py-3 rounded-lg transition-all duration-300 bg-transparent hover:bg-muted/30"
						onClick={handleThemeToggle}
					>
						<LightbulbIcon
							className={`w-5 h-5 mr-2 ${themeContext.themeSettings.mode === 'dark' ? 'text-yellow-400' : 'text-blue-400'}`}
						/>
						{themeContext.themeSettings.mode === 'dark' ? 'Light' : 'Dark'} Mode
					</Button>
				</div>
			</div>

			{/* interactive demo card */}
			<div className="w-full max-w-2xl mt-16 px-4">
				<Card
					borderAccent="primary"
					className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
				>
					<CardContent className="p-4 flex items-center gap-3">
						<SparklesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
						<p className="text-blue-800 dark:text-blue-200 text-sm">
							Interactive demo - Try the controls below!
						</p>
					</CardContent>
				</Card>

				<Card className="shadow-2xl border border-border-muted/50 backdrop-blur-sm bg-background/80">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							Live Component Demo
							<Activatable
								asChild={false}
								onChange={handlePremiumToggle}
								className={`transition-colors duration-200 rounded-lg px-3 py-1 text-sm ${premiumFeature ? 'bg-primary text-white' : ''}`}
							>
								<span className="flex items-center gap-2">
									{premiumFeature ? <CheckIcon className="w-3 h-3" /> : null}
									Premium Feature
								</span>
							</Activatable>
						</CardTitle>
					</CardHeader>

					<CardContent className="space-y-4">
						<div
							className={`text-lg leading-relaxed transition-all duration-300 ${
								boldFlag ? 'font-bold' : ''
							} ${italicFlag ? 'italic' : ''} ${strikeThroughFlag ? 'line-through' : ''} ${premiumFeature ? 'text-primary' : ''}`}
						>
							{premiumFeature ? (
								<>
									🚀 <strong>Premium Experience Activated!</strong> This demonstrates how ssword-ui
									components work together to create rich, interactive interfaces with smooth
									transitions and cohesive design language.
								</>
							) : (
								<>
									Empower your creativity with{' '}
									<code className="bg-muted px-1 rounded">ssword-ui</code>. From intuitive layouts
									to expressive components, it gives you everything you need to design refined,
									responsive, and accessible interfaces.
								</>
							)}
						</div>

						<CardFooter className="bg-muted/50 p-2 rounded-lg gap-1 [&>.activateable]:aspect-square">
							<button onClick={() => console.log('Test')}>
								<Text>Test</Text>
							</button>

							<Activatable
								onToggle={handleBoldFeatureToggle}
								className={`transition-colors duration-200 hover:scale-105 ${boldFlag ? 'bg-primary text-white' : ''}`}
							>
								<BoldIcon className="w-4 h-4" />
							</Activatable>

							<Activatable
								onToggle={handleItalicFeatureToggle}
								className={`transition-colors duration-200 hover:scale-105 ${italicFlag ? 'bg-primary text-white' : ''}`}
							>
								<ItalicIcon className="w-4 h-4" />
							</Activatable>

							<Activatable
								onToggle={handleStrikeThroughFeatureToggle}
								className={`transition-colors duration-200 hover:scale-105 ${strikeThroughFlag ? 'bg-primary text-white' : ''}`}
							>
								<StrikethroughIcon className="w-4 h-4" />
							</Activatable>

							<div className="flex-1" />

							<div className="text-xs text-text-muted px-2 py-1 bg-white/50 dark:bg-black/30 rounded">
								{formatActiveFeatures}
							</div>
						</CardFooter>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
