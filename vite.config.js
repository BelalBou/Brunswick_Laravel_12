import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/index.tsx'
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    server: {
        cors: true,
        strictPort: true,
        port: 5173,
        hmr: {
            host: 'localhost'
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'redux-promise'],
    },
});
