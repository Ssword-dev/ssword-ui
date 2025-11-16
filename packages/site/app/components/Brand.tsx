import { Text } from '@ssword-ui/vue';
import { defineComponent } from 'vue';

const Brand = defineComponent({
	name: 'Brand',
	render() {
		return (
			<div class="flex items-center justify-center h-full gap-2 select-none">
				{/* Wrap in flex container */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-brush w-6 h-6 -mt-0.5" // Negative top margin
				>
					<defs>
						<linearGradient
							gradientUnits="userSpaceOnUse"
							id="tgrad"
						>
							<stop
								offset="0%"
								stop-color="var(--pallete-color-accent)"
							/>
							<stop
								offset="100%"
								stop-color="var(--pallete-color-accent-strong)"
							/>
						</linearGradient>
					</defs>
					<path
						class="stroke-text-muted"
						d="m11 10 3 3"
					/>
					<path
						class="stroke-accent"
						fill="transparent"
						d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z"
					/>
					<path
						class="stroke-[#8a6748]"
						d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031"
					/>
				</svg>
				<Text size="xl">ssword-ui</Text>
			</div>
		);
	},
});

export default Brand;
