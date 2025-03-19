import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/index.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            '@components': path.resolve(__dirname, './resources/js/components'),
            '@containers': path.resolve(__dirname, './resources/js/containers'),
            '@services': path.resolve(__dirname, './resources/js/services'),
            '@utils': path.resolve(__dirname, './resources/js/utils'),
            '@types': path.resolve(__dirname, './resources/js/types'),
            '@images': path.resolve(__dirname, './resources/js/images'),
            '@scss': path.resolve(__dirname, './resources/js/scss'),
            '@interfaces': path.resolve(__dirname, './resources/js/interfaces'),
            '@reducers': path.resolve(__dirname, './resources/js/reducers'),
            '@actions': path.resolve(__dirname, './resources/js/actions'),
        }
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        outDir: 'public/build',
        assetsDir: '',
        manifest: true,
        rollupOptions: {
            input: 'resources/js/index.tsx'
        }
    },
    optimizeDeps: {
        include: [
            '@emotion/react',
            '@emotion/styled',
            '@mui/material',
            '@mui/icons-material',
            'react-router-dom',
            'react-redux',
            '@reduxjs/toolkit'
        ]
    }
}); 