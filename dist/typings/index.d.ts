import { Plugin } from 'rollup';
export interface ITotalSizePluginOption {
    /** 是否禁用插件 */
    disable: boolean;
    /** 当文件体积达到一定程度后, 发出警告 */
    max: number;
    /** 是否显示总计数据 */
    total: boolean;
}
/** 统计 rollup 打包文件体积 */
export declare const totalSize: (options?: Partial<ITotalSizePluginOption>) => Plugin;
