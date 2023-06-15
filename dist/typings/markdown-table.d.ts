export declare type TMarkdownAlign = string | Array<string | null | undefined> | null | undefined;
/**
 * Configuration (optional).
 */
export interface MarkdownTableOptions {
    /**
     * One style for all columns, or styles for their respective columns.
     * Each style is either `'l'` (left), `'r'` (right), or `'c'` (center).
     * Other values are treated as `''`, which doesn’t place the colon in the
     * alignment row but does align left.
     * *Only the lowercased first character is used, so `Right` is fine.*
     */
    align?: string | Array<string | null | undefined> | null | undefined;
    /**
     * Whether to add a space of padding between delimiters and cells.
     *
     * When `true`, there is padding:
     *
     * ```markdown
     * | Alpha | B     |
     * | ----- | ----- |
     * | C     | Delta |
     * ```
     *
     * When `false`, there is no padding:
     *
     * ```markdown
     * |Alpha|B    |
     * |-----|-----|
     * |C    |Delta|
     * ```
     */
    padding?: boolean | undefined;
    /**
     * Whether to begin each row with the delimiter.
     *
     * > 👉 **Note**: please don’t use this: it could create fragile structures
     * > that aren’t understandable to some markdown parsers.
     *
     * When `true`, there are starting delimiters:
     *
     * ```markdown
     * | Alpha | B     |
     * | ----- | ----- |
     * | C     | Delta |
     * ```
     *
     * When `false`, there are no starting delimiters:
     *
     * ```markdown
     * Alpha | B     |
     * ----- | ----- |
     * C     | Delta |
     * ```
     */
    delimiterStart?: boolean | undefined;
    /**
     * Whether to end each row with the delimiter.
     *
     * > 👉 **Note**: please don’t use this: it could create fragile structures
     * > that aren’t understandable to some markdown parsers.
     *
     * When `true`, there are ending delimiters:
     *
     * ```markdown
     * | Alpha | B     |
     * | ----- | ----- |
     * | C     | Delta |
     * ```
     *
     * When `false`, there are no ending delimiters:
     *
     * ```markdown
     * | Alpha | B
     * | ----- | -----
     * | C     | Delta
     * ```
     */
    delimiterEnd?: boolean | undefined;
    /**
     * Whether to align the delimiters.
     * By default, they are aligned:
     *
     * ```markdown
     * | Alpha | B     |
     * | ----- | ----- |
     * | C     | Delta |
     * ```
     *
     * Pass `false` to make them staggered:
     *
     * ```markdown
     * | Alpha | B |
     * | - | - |
     * | C | Delta |
     * ```
     */
    alignDelimiters?: boolean | undefined;
    /**
     * Function to detect the length of table cell content.
     * This is used when aligning the delimiters (`|`) between table cells.
     * Full-width characters and emoji mess up delimiter alignment when viewing
     * the markdown source.
     * To fix this, you can pass this function, which receives the cell content
     * and returns its “visible” size.
     * Note that what is and isn’t visible depends on where the text is displayed.
     *
     * Without such a function, the following:
     *
     * ```js
     * markdownTable([
     * ['Alpha', 'Bravo'],
     * ['中文', 'Charlie'],
     * ['👩‍❤️‍👩', 'Delta']
     * ])
     * ```
     *
     * Yields:
     *
     * ```markdown
     * | Alpha | Bravo |
     * | - | - |
     * | 中文 | Charlie |
     * | 👩‍❤️‍👩 | Delta |
     * ```
     *
     * With [`string-width`](https://github.com/sindresorhus/string-width):
     *
     * ```js
     * import stringWidth from 'string-width'
     *
     * markdownTable(
     * [
     * ['Alpha', 'Bravo'],
     * ['中文', 'Charlie'],
     * ['👩‍❤️‍👩', 'Delta']
     * ],
     * {stringLength: stringWidth}
     * )
     * ```
     *
     * Yields:
     *
     * ```markdown
     * | Alpha | Bravo   |
     * | ----- | ------- |
     * | 中文  | Charlie |
     * | 👩‍❤️‍👩    | Delta   |
     * ```
     */
    stringLength?: ((value: string) => number) | undefined;
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
export declare function markdownTable(table: Array<Array<string | null | undefined>>, options?: MarkdownTableOptions | undefined): string;
