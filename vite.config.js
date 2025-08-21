import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
    plugins: [react(), basicSsl()],
    server: {
        port: 3000,
        host: true,
        allowedHosts: ['38d076baf2bae342305b842b8a1b05d6.serveo.net'],
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        // Удалите rollupOptions.input - это ломает сборку
    }
});