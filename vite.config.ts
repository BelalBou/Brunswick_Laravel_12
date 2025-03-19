import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/index.tsx'
            ],
            refresh: true,
        }),
        react({
            jsxRuntime: 'automatic',
            babel: {
                presets: ['@babel/preset-react', '@babel/preset-typescript'],
                plugins: ['@babel/plugin-transform-react-jsx']
            }
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            'components': path.resolve(__dirname, './resources/js/components'),
            'utils': path.resolve(__dirname, './resources/js/utils'),
            'actions': path.resolve(__dirname, './resources/js/actions'),
            'reducers': path.resolve(__dirname, './resources/js/reducers'),
            'interfaces': path.resolve(__dirname, './resources/js/interfaces'),
            'types': path.resolve(__dirname, './resources/js/types'),
        },
    },
    server: {
        cors: true,
        strictPort: true,
        port: 5173,
        hmr: {
            host: 'localhost',
            protocol: 'ws'
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'redux',
            'react-redux',
            'redux-thunk',
            'redux-promise',
            'react-data-export',
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            '@material-ui/core',
            '@material-ui/icons'
        ],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'redux-vendor': ['redux', 'react-redux', 'redux-thunk', 'redux-promise'],
                    'mui-vendor': ['@mui/material', '@mui/icons-material'],
                    'material-ui-vendor': ['@material-ui/core', '@material-ui/icons']
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            css: {
                additionalData: `@import "@/css/index.css";`
            }
        }
    },
    esbuild: {
        jsxDev: true,
        jsxInject: `import React from 'react'`,
        loader: 'tsx',
        include: /src\/.*\.[tj]sx?$/,
        exclude: [],
    }
}); 