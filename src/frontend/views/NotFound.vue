<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div class="actions">
        <router-link to="/" class="back-button">Go to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed
</script>

<style lang="scss" scoped>
@use "sass:color";

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--background-color, #111);
  color: var(--text-color, #ecf0f1);
}

.content {
  text-align: center;
  padding: 2rem;

  h1 {
    font-size: 8rem;
    margin: 0;
    color: var(--primary-color, #ff6b01);
    line-height: 1;
  }

  h2 {
    font-size: 2rem;
    margin: 0 0 1rem 0;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #999;
  }
}

.actions {
  margin-top: 2rem;

  .back-button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: var(--primary-color, #ff6b01);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.3s;

    &:hover {
      background-color: color.adjust(#ff6b01, $lightness: -10%);
    }
  }
}
</style>
