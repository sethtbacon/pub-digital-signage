import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import plugins
import themePlugin from './plugins/themePlugin';

// Import global styles
import './assets/styles/theme.scss';
import './assets/styles/admin'; // Using the new admin styles via index.js

// Initialize Pinia (state management)
const pinia = createPinia();

// Create Vue application
const app = createApp(App);

// Register plugins
app.use(pinia);
app.use(router);
app.use(themePlugin);

// Mount the app
app.mount('#app');
