import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite configuration for Bk (Meteor + Vue 3)
export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  meteor: {
    clientEntry: 'imports/ui/main.js',
  },
  resolve: {
    alias: [
      { find: 'meteor/meteor', replacement: '/src/vite-shims/meteor-meteor.js' },
      { find: 'meteor/tracker', replacement: '/src/vite-shims/meteor-tracker.js' },
      { find: 'meteor/mongo', replacement: '/src/vite-shims/meteor-mongo.js' },
      { find: /^meteor\/.*$/, replacement: '/src/vite-shims/meteor-generic.js' }
    ]
  },
  optimizeDeps: {
    // RegExp in exclude can break esbuild plugins; keep to string entries only
    exclude: ['vue-meteor-tracker', 'meteor/meteor', 'meteor/tracker', 'meteor/mongo'],
  },
  build: {
    rollupOptions: {
      external: ['meteor/meteor','meteor/tracker','meteor/mongo', /^meteor\//],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separate TipTap dependencies
            if (id.includes('@tiptap')) {
              return 'tiptap'
            }
            // Separate Chart.js and vue-chartjs
            if (id.includes('chart.js') || id.includes('vue-chartjs')) {
              return 'charts'
            }
            // Separate Bootstrap and BootstrapVue
            if (id.includes('bootstrap')) {
              return 'bootstrap'
            }
            // Separate Vue core and reactivity
            if (id.includes('vue') || id.includes('@vue')) {
              return 'vue'
            }
            // Separate lodash
            if (id.includes('lodash')) {
              return 'lodash'
            }
            // All other node_modules go to vendor chunk
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
