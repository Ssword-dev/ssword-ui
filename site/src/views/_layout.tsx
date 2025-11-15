import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent({
	name: 'PageLayout',
	render() {
		return (
			<>
				<div class="h-screen w-screen grid-cols-[auto,1fr,auto] grid-">
					<Header />
					<main class="h-full w-full px-4 py-2">
						<RouterView />
					</main>
					<Footer />
				</div>
			</>
		);
	},
});
