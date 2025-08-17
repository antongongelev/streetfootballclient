import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3001,
        host: true,
        allowedHosts: ['0d099b2db2ad629b5b7c819fbef2eecf.serveo.net'],
        // Удалите allowedHosts - это не нужно для serveo/ngrok
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        // Удалите rollupOptions.input - это ломает сборку
    }
});