import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src/pages',
    publicDir: '../../public',
    build: {
        outDir: '../../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/pages/index.html'),
                grammarBasedSampling: resolve(__dirname, 'src/pages/grammar-based-sampling/index.html'),
                quantizationError: resolve(__dirname, 'src/pages/what-is-lost-in-quantization/index.html'),
                lateNow: resolve(__dirname, 'src/pages/late-now-generative-show/index.html'),
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});
