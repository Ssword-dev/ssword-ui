import { Text } from '@ssword-ui/vue';
import { defineComponent } from 'vue';

const Footer = defineComponent({
	setup() {
		return () => (
			<footer class="flex flex-col h-auto bg-background border-t border-border-muted/30 py-4">
				<div class="justify-self-center self-center">
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
	},
});

export default Footer;
