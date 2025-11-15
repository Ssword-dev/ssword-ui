import './styles/tailwind.css';

// vue
import { createApp } from 'vue';

// pinia state management
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';

// vue router
import router from './router';
import { theme } from '@ssword-ui/vue';

// app root
import Root from './Root.vue';

const app = createApp(Root);
const pinia = createPinia();

pinia.use(piniaPersist);

app.use(pinia);
app.use(theme());
app.use(router);

app.mount('#app');
