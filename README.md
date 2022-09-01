# rollup-plugin-total-size

![npm](https://img.shields.io/npm/dw/rollup-plugin-total-size.svg)
[![GitHub stars](https://img.shields.io/github/stars/halo951/rollup-plugin-total-size.svg?style=social&label=rollup-plugin-total-size)](https://github.com/halo951/rollup-plugin-total-size)
[![npm version](https://badge.fury.io/js/rollup-plugin-total-size.svg)](https://badge.fury.io/js/rollup-plugin-total-size)

> 适用于 vue 项目的 echarts 图表集合

## install

```bash

yarn add rollup-plugin-total-size

```

## usage

```typescript
import { RollupOptions } from 'rollup'
import { totalSize } from 'rollup-plugin-total-size'

/** export rollup.config */
export default async (): Promise<RollupOptions | Array<RollupOptions>> => {
    return {
        plugins: [totalSize()]
    }
}
```

## options

| key     | description                    |
| ------- | ------------------------------ |
| total   | 统计 dist 体积综合             |
| max     | 当单文件体积超过阈值, 发出提示 |
| disable | 禁用统计 (比如: --watch)       |
