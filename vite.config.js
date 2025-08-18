import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true,
        allowedHosts: ['675123fe76d3204db7a3f754eaee47af.serveo.net'],
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        // Удалите rollupOptions.input - это ломает сборку
    }
});