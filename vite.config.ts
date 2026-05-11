import { defineConfig, normalizePath, type Plugin } from 'vite'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))



function figmaAssetResolver(): Plugin {
  return {
    name: 'figma-asset-resolver',
    resolveId(source) {
      if (!source.startsWith('figma:asset/')) return null
      
      const protocol = 'figma:asset/'
      const [filePath, ...rest] = source.slice(protocol.length).split(/([?#])/)
      const query = rest.join('')
      
      if (filePath.includes('..')) return null
      
      return {
        id: normalizePath(path.resolve(__dirname, 'src/assets', filePath)) + query,
        moduleSideEffects: false
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
