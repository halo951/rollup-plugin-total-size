import chalk from 'chalk'
import { OutputBundle, Plugin } from 'rollup'
import { gzipSync } from 'zlib'
import { compress } from 'brotli-wasm'
import { markdownTable } from './markdown-table'
import boxen from 'boxen'
import prettier from 'prettier'

export interface ITotalSizePluginOption {
    /** 是否禁用插件 */
    disable: boolean
    /** 当文件体积达到一定程度后, 发出警告 */
    max: number
    /** 是否显示总计数据 */
    total: boolean
}

const uint8ArrayToString = (fileData: Uint8Array): string => {
    let dataString: string = ''
    for (let i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i])
    }
    return dataString
}
const stringToUint8Array = (str: string): Uint8Array => {
    let arr: Array<any> = []
    for (let i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i))
    }
    return new Uint8Array(arr)
}

const num2kb = (num: number) => Number((num / 1024).toFixed(2))

/** 统计 rollup 打包文件体积 */
export const totalSize = (options: Partial<ITotalSizePluginOption> = {}): Plugin => {
    const files: {
        [fileName: string]: {
            originSize: number
            gzippedSize: number
            compressSize: number
        }
    } = {}
    const plugin: Plugin = {
        name: 'rollup-plugin-total-size',
        async generateBundle(_, bundles: OutputBundle) {
            if (options.disable) return
            for (const fileName in bundles) {
                const bundle = bundles[fileName]
                let code!: string
                if (bundle.type === 'asset') {
                    if (typeof bundle.source === 'string') {
                        code = bundle.source
                    } else {
                        code = uint8ArrayToString(bundle.source)
                    }
                } else if (bundle.type === 'chunk') {
                    code = bundle.code
                }

                const gzipped = gzipSync(code)
                const compressed = await compress(stringToUint8Array(code))

                // set to map
                files[fileName] = {
                    originSize: code.length,
                    gzippedSize: gzipped.length,
                    compressSize: compressed.length
                }
            }
        },
        closeBundle(): void {
            if (options.disable) return
            let table: Array<Array<string>> = [
                ['file', 'origin size', 'gzipped size', 'compressed size'].map((h) => chalk.blue(h))
            ]
            const transform = (num: number) => {
                let warn = options.max && num > options.max * 1024
                return chalk[warn ? 'yellow' : 'white'](num2kb(num) + 'kb')
            }
            const total = (key: 'originSize' | 'gzippedSize' | 'compressSize') => {
                return Object.values(files)
                    .map((f) => f[key])
                    .reduce((total, val) => total + val, 0)
            }
            for (const fn in files) {
                const { originSize, gzippedSize, compressSize } = files[fn]
                table.push([fn, transform(originSize), transform(gzippedSize), transform(compressSize)])
            }
            if (options.total) {
                options.max = 0
                table.push([
                    '总计',
                    transform(total('originSize')),
                    transform(total('gzippedSize')),
                    transform(total('compressSize'))
                ])
            }
            let out: string = markdownTable(table)
            out = prettier.format(out, { parser: 'markdown' })
            console.log(
                boxen(out, {
                    title: 'rollup bundle size',
                    padding: { top: 1, bottom: 0, left: 2, right: 2 },
                    borderColor: '#0969da'
                })
            )
        }
    }
    return plugin
}
