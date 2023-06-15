/** 
 * rollup-plugin-total-size@1.1.0
 * 
 * Copyright (c) 2023 halo951 <https://github.com/halo951>
 * Released under MIT License
 * 
 * @build Thu Jun 15 2023 15:43:59 GMT+0800 (中国标准时间)
 * @author halo951(https://github.com/halo951)
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chalk = require('chalk');
var zlib = require('zlib');
var brotliWasm = require('brotli-wasm');
var boxen = require('boxen');
var prettier = require('prettier');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var boxen__default = /*#__PURE__*/_interopDefaultLegacy(boxen);
var prettier__default = /*#__PURE__*/_interopDefaultLegacy(prettier);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * Generate a markdown ([GFM](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables)) table..
 *
 * @param {Array<Array<string|null|undefined>>} table
 *   Table data (matrix of strings).
 * @param {Options} [options]
 *   Configuration (optional).
 * @returns {string}
 */
function markdownTable(table, options = {}) {
    const align = (options.align || []).concat();
    const stringLength = options.stringLength || defaultStringLength;
    /** Character codes as symbols for alignment per column. */
    const alignments = [];
    /** Cells per row. */
    const cellMatrix = [];
    /** Sizes of each cell per row. */
    const sizeMatrix = [];
    /**  */
    const longestCellByColumn = [];
    let mostCellsPerRow = 0;
    let rowIndex = -1;
    // This is a superfluous loop if we don’t align delimiters, but otherwise we’d
    // do superfluous work when aligning, so optimize for aligning.
    while (++rowIndex < table.length) {
        /** @type {Array<string>} */
        const row = [];
        /** @type {Array<number>} */
        const sizes = [];
        let columnIndex = -1;
        if (table[rowIndex].length > mostCellsPerRow) {
            mostCellsPerRow = table[rowIndex].length;
        }
        while (++columnIndex < table[rowIndex].length) {
            const cell = serialize(table[rowIndex][columnIndex]);
            if (options.alignDelimiters !== false) {
                const size = stringLength(cell);
                sizes[columnIndex] = size;
                if (longestCellByColumn[columnIndex] === undefined || size > longestCellByColumn[columnIndex]) {
                    longestCellByColumn[columnIndex] = size;
                }
            }
            row.push(cell);
        }
        cellMatrix[rowIndex] = row;
        sizeMatrix[rowIndex] = sizes;
    }
    // Figure out which alignments to use.
    let columnIndex = -1;
    if (typeof align === 'object' && 'length' in align) {
        while (++columnIndex < mostCellsPerRow) {
            alignments[columnIndex] = toAlignment(align[columnIndex]);
        }
    }
    else {
        const code = toAlignment(align);
        while (++columnIndex < mostCellsPerRow) {
            alignments[columnIndex] = code;
        }
    }
    // Inject the alignment row.
    columnIndex = -1;
    /** @type {Array<string>} */
    const row = [];
    /** @type {Array<number>} */
    const sizes = [];
    while (++columnIndex < mostCellsPerRow) {
        const code = alignments[columnIndex];
        let before = '';
        let after = '';
        if (code === 99 /* `c` */) {
            before = ':';
            after = ':';
        }
        else if (code === 108 /* `l` */) {
            before = ':';
        }
        else if (code === 114 /* `r` */) {
            after = ':';
        }
        // There *must* be at least one hyphen-minus in each alignment cell.
        let size = options.alignDelimiters === false
            ? 1
            : Math.max(1, longestCellByColumn[columnIndex] - before.length - after.length);
        const cell = before + '-'.repeat(size) + after;
        if (options.alignDelimiters !== false) {
            size = before.length + size + after.length;
            if (size > longestCellByColumn[columnIndex]) {
                longestCellByColumn[columnIndex] = size;
            }
            sizes[columnIndex] = size;
        }
        row[columnIndex] = cell;
    }
    // Inject the alignment row.
    cellMatrix.splice(1, 0, row);
    sizeMatrix.splice(1, 0, sizes);
    rowIndex = -1;
    /** @type {Array<string>} */
    const lines = [];
    while (++rowIndex < cellMatrix.length) {
        const row = cellMatrix[rowIndex];
        const sizes = sizeMatrix[rowIndex];
        columnIndex = -1;
        /** @type {Array<string>} */
        const line = [];
        while (++columnIndex < mostCellsPerRow) {
            const cell = row[columnIndex] || '';
            let before = '';
            let after = '';
            if (options.alignDelimiters !== false) {
                const size = longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0);
                const code = alignments[columnIndex];
                if (code === 114 /* `r` */) {
                    before = ' '.repeat(size);
                }
                else if (code === 99 /* `c` */) {
                    if (size % 2) {
                        before = ' '.repeat(size / 2 + 0.5);
                        after = ' '.repeat(size / 2 - 0.5);
                    }
                    else {
                        before = ' '.repeat(size / 2);
                        after = before;
                    }
                }
                else {
                    after = ' '.repeat(size);
                }
            }
            if (options.delimiterStart !== false && !columnIndex) {
                line.push('|');
            }
            if (options.padding !== false &&
                // Don’t add the opening space if we’re not aligning and the cell is
                // empty: there will be a closing space.
                !(options.alignDelimiters === false && cell === '') &&
                (options.delimiterStart !== false || columnIndex)) {
                line.push(' ');
            }
            if (options.alignDelimiters !== false) {
                line.push(before);
            }
            line.push(cell);
            if (options.alignDelimiters !== false) {
                line.push(after);
            }
            if (options.padding !== false) {
                line.push(' ');
            }
            if (options.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) {
                line.push('|');
            }
        }
        lines.push(options.delimiterEnd === false ? line.join('').replace(/ +$/, '') : line.join(''));
    }
    return lines.join('\n');
}
function serialize(value) {
    return value === null || value === undefined ? '' : String(value);
}
function defaultStringLength(value) {
    return value.length;
}
function toAlignment(value) {
    const code = typeof value === 'string' ? value.codePointAt(0) : 0;
    return code === 67 /* `C` */ || code === 99 /* `c` */
        ? 99 /* `c` */
        : code === 76 /* `L` */ || code === 108 /* `l` */
            ? 108 /* `l` */
            : code === 82 /* `R` */ || code === 114 /* `r` */
                ? 114 /* `r` */
                : 0;
}

const uint8ArrayToString = (fileData) => {
    let dataString = '';
    for (let i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i]);
    }
    return dataString;
};
const stringToUint8Array = (str) => {
    let arr = [];
    for (let i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i));
    }
    return new Uint8Array(arr);
};
const num2kb = (num) => Number((num / 1024).toFixed(2));
/** 统计 rollup 打包文件体积 */
const totalSize = (options = {}) => {
    const files = {};
    const plugin = {
        name: 'rollup-plugin-total-size',
        generateBundle(_, bundles) {
            return __awaiter(this, void 0, void 0, function* () {
                if (options.disable)
                    return;
                for (const fileName in bundles) {
                    const bundle = bundles[fileName];
                    let code;
                    if (bundle.type === 'asset') {
                        if (typeof bundle.source === 'string') {
                            code = bundle.source;
                        }
                        else {
                            code = uint8ArrayToString(bundle.source);
                        }
                    }
                    else if (bundle.type === 'chunk') {
                        code = bundle.code;
                    }
                    const gzipped = zlib.gzipSync(code);
                    const compressed = yield brotliWasm.compress(stringToUint8Array(code));
                    // set to map
                    files[fileName] = {
                        originSize: code.length,
                        gzippedSize: gzipped.length,
                        compressSize: compressed.length
                    };
                }
            });
        },
        closeBundle() {
            if (options.disable)
                return;
            let table = [
                ['file', 'origin size', 'gzipped size', 'compressed size'].map((h) => chalk__default["default"].blue(h))
            ];
            const transform = (num) => {
                let warn = options.max && num > options.max * 1024;
                return chalk__default["default"][warn ? 'yellow' : 'white'](num2kb(num) + 'kb');
            };
            const total = (key) => {
                return Object.values(files)
                    .map((f) => f[key])
                    .reduce((total, val) => total + val, 0);
            };
            for (const fn in files) {
                const { originSize, gzippedSize, compressSize } = files[fn];
                table.push([fn, transform(originSize), transform(gzippedSize), transform(compressSize)]);
            }
            if (options.total) {
                options.max = 0;
                table.push([
                    '总计',
                    transform(total('originSize')),
                    transform(total('gzippedSize')),
                    transform(total('compressSize'))
                ]);
            }
            let out = markdownTable(table);
            out = prettier__default["default"].format(out, { parser: 'markdown' });
            console.log(boxen__default["default"](out, {
                title: 'rollup bundle size',
                padding: { top: 1, bottom: 0, left: 2, right: 2 },
                borderColor: '#0969da'
            }));
        }
    };
    return plugin;
};

exports.totalSize = totalSize;
