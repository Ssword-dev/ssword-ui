import { createRouter, createWebHistory } from 'vue-router';

function lazyLoadedView(path: string, name: string, component: () => Promise<unknown>) {
	return {
		path,
		name,
		component,
	};
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [lazyLoadedView('/', 'Home', () => import('../views/HomeView.vue'))],
});

export default router;
