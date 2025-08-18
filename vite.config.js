import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true,
        allowedHosts: ['63fd666ef942edac2c8493030d3a9237.serveo.net'],
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        // Удалите rollupOptions.input - это ломает сборку
    }
});