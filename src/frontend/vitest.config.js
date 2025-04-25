import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      // Look for tests in both the frontend directory and the tests directory
      './src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      '../../tests/unit/**/*.spec.{js,ts,jsx,tsx}',
      '../../tests/integration/**/*.spec.{js,ts,jsx,tsx}'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});