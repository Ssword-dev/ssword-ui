import './styles/tailwind.css';

// vue
import { createApp } from 'vue';

// pinia state management
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';

// router

// app root
import Root from './Root.vue';

// vue router
import router from './router';

const app = createApp(Root);
const pinia = createPinia();

pinia.use(piniaPersist);

app.use(pinia);
app.use(router);

app.mount('#app');
