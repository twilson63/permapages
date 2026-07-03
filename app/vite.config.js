import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import tailwindConfig from './tailwind.config.js'
import fs from 'fs'
// import { dependencies } from './package.json';
const { dependencies } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

const [schema, host] = process.env.GITPOD_WORKSPACE_URL ? process.env.GITPOD_WORKSPACE_URL.split('://') : [null, null]
const publicUrl = `5173-${host}`

function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    // vendor deps share one chunk; dynamically-imported deps must be left
    // out entirely so they stay off the initial-load module graph
    if (['ramda', 'crocks', 'zod', 'marked', 'dompurify', '@ar.io/sdk'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  // @ar.io/sdk's bundling dep (arbundles) expects node's crypto/buffer in the browser
  plugins: [nodePolyfills({ include: ['crypto', 'buffer', 'stream', 'process'] }), svelte()],
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
  },
  optimizeDeps: {
    exclude: ['tinro']
  },
  server: {
    hmr: {
      clientPort: host ? 443 : 5173,
      host: host
        ? publicUrl
        : "localhost",
    }
  },
  css: {
    postcss: {
      plugins: [tailwind(tailwindConfig), autoprefixer],
    }

  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['ramda', 'crocks', 'zod', 'marked', 'dompurify'],
          ...renderChunks(dependencies),
        },
      },
    },
  }
})
