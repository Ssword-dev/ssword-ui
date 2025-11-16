import type { Plugin } from 'vue';
import { defineNuxtPlugin } from 'nuxt/app';

type NuxtCompatStage = 'immediate' | 'normal' | 'after-setup';

interface NuxtCompatOptions {
	name?: string;
	clientOnly?: boolean;
	stage?: NuxtCompatStage;
}

const stageTranslation = {
	immediate: 'pre',
	normal: 'default',
	'after-setup': 'post',
} as const;

function translateStageToEnforce(stage: NuxtCompatStage) {
	return stageTranslation[stage] ?? 'default';
}

export default function nuxtCompat(plugins: Plugin[], options: NuxtCompatOptions = {}) {
	return defineNuxtPlugin({
		name: options.name ?? 'nuxtCompat',

		enforce: translateStageToEnforce(options.stage ?? 'normal'),

		setup(nuxtApp) {
			if (options.clientOnly && import.meta.server) {
				return;
			}

			for (const p of plugins) {
				nuxtApp.vueApp.use(p);
			}
		},
	});
}
