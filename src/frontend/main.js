import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Initialize Pinia (state management)
const pinia = createPinia();

// Create Vue application
const app = createApp(App);

// Register plugins
app.use(pinia);
app.use(router);

// Mount the app
app.mount('#app');