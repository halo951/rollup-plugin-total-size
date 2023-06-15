import typescript from 'rollup-plugin-typescript2'
import { RollupOptions } from 'rollup'
import pkg from './package.json'
import { totalSize } from './src/index'

const banner: string = `
/** 
 * ${pkg.name}@${pkg.version}
 * 
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.url}>
 * Released under ${pkg.license} License
 * 
 * @build ${new Date()}
 * @author ${pkg.author.name}(${pkg.author.url})
 * @license ${pkg.license}
 */`.trim()
/** export rollup.config */
export default async (): Promise<RollupOptions | Array<RollupOptions>> => {
    const plugins = [
        // 编译
        typescript({
            clean: true,
            useTsconfigDeclarationDir: true,
            abortOnError: true,
            include: ['src/**/*.ts'],
            tsconfigDefaults: {
                importHelpers: true,
                strict: true,
                noImplicitAny: true,
                noImplicitThis: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                strictNullChecks: true,
                strictPropertyInitialization: true
            }
        }),
        totalSize({ total: true })
    ]
    const external = ['chalk', 'zlib', 'brotli-wasm', 'boxen', 'prettier']
    return {
        input: 'src/index.ts',
        plugins,
        external,
        output: [
            { format: 'cjs', exports: 'auto', file: `dist/index.js`, banner },
            { format: 'es', exports: 'auto', file: `dist/index.mjs`, banner }
        ]
    }
}
