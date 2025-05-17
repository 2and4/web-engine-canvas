import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        emptyOutDir: true,
        lib: {
            dir: './dist',
            entry: 'src/index.ts',
            name: 'web-engine-canvas',
            fileName: (format) => `web-engine-canvas.${format}.js`,
        },
    },
    plugins: [
        dts({ 
            rollupTypes: false,
            exclude: ["tests"]
         }),
    ],
});