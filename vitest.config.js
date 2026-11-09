import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*-copilot-test.js'],
    coverage: {
      include: ['**/*.js'],
      exclude: ['**/*-copilot-test.js', 'vitest.config.js']
    }
  }
});
