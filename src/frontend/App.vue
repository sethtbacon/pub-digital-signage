<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Root component setup
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