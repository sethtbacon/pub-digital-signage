<template>
  <div id="app">
    <PageTransition :name="transitionName">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </PageTransition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import PageTransition from './components/layout/PageTransition.vue';

const router = useRouter();
const transitionName = ref('fade');

// Watch for route changes to set appropriate transition
watch(() => router.currentRoute.value, (to, from) => {
  // Default transition
  transitionName.value = 'fade';
  
  // Check if to/from exist and have path properties
  const toPath = to?.path || '';
  const fromPath = from?.path || '';
  
  // Special transitions for display routes
  if (toPath.includes('/display/') && fromPath.includes('/display/')) {
    transitionName.value = 'slide';
  }
  
  // Use zoom transition when going to or from admin
  if (toPath.includes('/admin') || fromPath.includes('/admin')) {
    transitionName.value = 'zoom';
  }
  
  // Use flip for dramatic transitions (e.g., games)
  if (toPath.includes('/display/games') || fromPath.includes('/display/games')) {
    transitionName.value = 'flip';
  }
}, { immediate: true });
</script>

<style lang="scss">
:root {
  /* Base color variables */
  --primary-color: #ff6b01; /* Orange */
  --secondary-color: #2c3e50; /* Dark blue-grey */
  --accent-color: #e74c3c; /* Red */
  --background-color: #111; /* Dark background for pub environment */
  --text-color: #ecf0f1; /* Light text for dark background */
  
  /* Font sizes for readability on large displays */
  --font-size-small: 1rem;
  --font-size-medium: 1.5rem;
  --font-size-large: 2rem;
  --font-size-xlarge: 3rem;
  
  /* Spacing variables */
  --spacing-small: 0.5rem;
  --spacing-medium: 1rem;
  --spacing-large: 2rem;
  --spacing-xlarge: 3rem;
}

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: 'Arial', sans-serif;
  overflow: hidden; /* Prevent scrolling for kiosk mode */
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* High contrast and visibility for pub environment */
h1, h2, h3, h4, h5, h6 {
  margin-bottom: var(--spacing-medium);
  font-weight: bold;
}

h1 {
  font-size: var(--font-size-xlarge);
}

h2 {
  font-size: var(--font-size-large);
}

h3 {
  font-size: var(--font-size-medium);
}
</style>