import { defineConfig } from 'vite'
import resources from '../src/index.js'

export default defineConfig({
  plugins: [
    resources({
      loaders: '/tests/loaders.ts',
    }),
  ],
  publicDir: 'tests/public',
  resolve: {
    alias: [
      {
        find: 'vite-plugin-excalibur-resources',
        replacement: '/../src',
      },
    ],
  },

  test: {
    globals: true,
  },
})
