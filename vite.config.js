import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true,
        allowedHosts: ['6d691bfee9efb92e4ae267c665f76cc7.serveo.net'],
        // Удалите allowedHosts - это не нужно для serveo/ngrok
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        // Удалите rollupOptions.input - это ломает сборку
    }
});