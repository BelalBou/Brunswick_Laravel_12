import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx'
            ],
            refresh: true,
        }),
        react({
            include: '**/*.{jsx,tsx}',
            jsxRuntime: 'automatic',
            babel: {
                plugins: [
                    ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
                ]
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
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    server: {
        cors: {
            origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://[::1]:3000', 'http://localhost:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN'],
            credentials: true
        },
        strictPort: true,
        port: 3000,
        hmr: {
            host: 'localhost',
            protocol: 'ws',
            clientPort: 3000
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
                ws: true,
                configure: (proxy, options) => {
                    proxy.on('error', (err, req, res) => {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                }
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
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
        ],
        exclude: ['@material-ui/core', '@material-ui/icons', 'react-data-export', 'xlsx']
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'redux-vendor': ['redux', 'react-redux', 'redux-thunk', 'redux-promise'],
                    'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled']
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
    }
}); 