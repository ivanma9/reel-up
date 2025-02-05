import { defineConfig } from 'vitest/config'
import path from 'path'

// Load environment variables from .env.test or .env.local

export default defineConfig({
    test: {
        environment: 'node',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
}) 