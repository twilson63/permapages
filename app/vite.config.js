import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import tailwindConfig from './tailwind.config.js'
import fs from 'fs'
// import { dependencies } from './package.json';
const { dependencies } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

const [schema, host] = process.env.GITPOD_WORKSPACE_URL ? process.env.GITPOD_WORKSPACE_URL.split('://') : [null, null]
const publicUrl = `3000-${host}`

function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['ramda', 'crocks', 'zod', 'marked', 'dompurify'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [svelte()],
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    '__ATOMIC_ASSET_SRC__': '"x0ojRwrcHBmZP20Y4SY0mgusMRx-IYTjg5W8c3UFoNs"',
    '__STAMP_CONTRACT__': '"FMRHYgSijiUNBrFy-XqyNNXenHsCV0ThR4lGAPO4chA"'
  },
  optimizeDeps: {
    exclude: ['tinro']
  },
  server: {
    hmr: {
      clientPort: host ? 443 : 3000,
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
