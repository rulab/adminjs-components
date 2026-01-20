import {defineConfig} from "tsup";

export default defineConfig({
    entry: ['src/index.ts'],             // точка входа
    format: ['cjs', 'esm'],              // оба формата
    dts: true,                           // генерировать .d.ts
    sourcemap: true,                     // source map'ы для отладки
    clean: true,                         // очищать dist/ перед сборкой
    outDir: 'dist',                      // папка сборки
    target: 'esnext',                    // поддержка import.meta.url
    shims: true,                         // shim для __dirname и т.п.
    loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',                    // разрешить .tsx
    },
    bundle: false,
    external: [
        'path',
        'url',
        '@rulab/adminjs-components',
        '@rulab/adminjs-components/package.json'
    ]
})