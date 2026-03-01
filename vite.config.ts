import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  ssr: {
    // Bundle all dependencies into the output files
    noExternal: true,
  },
  build: {
    target: 'node24',
    ssr: true,
    rollupOptions: {
      input: {
        'configure-credentials/main': resolve(__dirname, 'src/configure-credentials/main.ts'),
        'invoke/main': resolve(__dirname, 'src/invoke/main.ts'),
        'invoke-session/main': resolve(__dirname, 'src/invoke-session/main.ts'),
        'invoke-session/cleanup': resolve(__dirname, 'src/invoke-session/cleanup.ts'),
        'run-tests/main': resolve(__dirname, 'src/run-tests/main.ts'),
        'setup-ew-cli/main': resolve(__dirname, 'src/setup-ew-cli/main.ts'),
        'use-emulator/main': resolve(__dirname, 'src/use-emulator/main.ts'),
        'use-emulator/cleanup': resolve(__dirname, 'src/use-emulator/cleanup.ts'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
})
