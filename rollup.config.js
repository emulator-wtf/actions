import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default defineConfig({
  input: {
    'configure-credentials/main': 'src/configure-credentials/main.ts',
    'invoke/main': 'src/invoke/main.ts',
    'invoke-session/main': 'src/invoke-session/main.ts',
    'invoke-session/cleanup': 'src/invoke-session/cleanup.ts',
    'run-tests/main': 'src/run-tests/main.ts',
    'setup-ew-cli/main': 'src/setup-ew-cli/main.ts',
    'use-emulator/main': 'src/use-emulator/main.ts',
    'use-emulator/cleanup': 'src/use-emulator/cleanup.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].js',
  },
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    typescript({ noEmit: false }),
    terser(),
  ],
})
