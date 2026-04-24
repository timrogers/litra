/**
 * Pads the provided array to a specified length, adding the required
 * number of occurences of the padding element to the end of the array.
 *
 * @param {any[]} array The array to pad
 * @param {number} length The required length for the array after padding
 * @param {any} paddingElement The element to pad the array with
 * @returns {any[]} The array padded to the required length
 */
export declare const padRight: (array: any[], length: number, paddingElement: any) => any[];
/**
 * Converts the provided integer into an array of two bytes, with the most
 * significant byte at the beginning of the array.
 *
 * Throws an error if the provided parameter is not an integer.
 *
 * @param {integer} integer The integer to convert into an array of bytes
 * @returns {[number, number]} The provided integer converted to an array
 * of type bytes, with the most significant byte at the beginning of the
 * array.
 */
export declare const integerToBytes: (integer: number) => [number, number];
/**
 * Finds a given percentage within a range - for example, the 50% marker
 * in the range 0 to 200 is 100.
 *
 * @param {number} percentage The percentage to find within the range
 * @param {number} startRange The number at the start of the range
 * @param {number} endRange The number at the end of the range
 * @returns {number} The value at the given percentage
 */
export declare const percentageWithinRange: (percentage: number, startRange: number, endRange: number) => number;
/**
 * Finds all multiples of a given integer within a range. The returned
 * list of multiples may or may not include the values at the start and
 * the end of the range.
 *
 * For example:
 *   - the multiples of 3 within the range 0 to 10 are 0, 3, 6, 9
 *   - the multiples of 3 within the range 1 to 10 are 3, 6, 9
 *   - the multiples of 5 within the range 0 to 20 are 0, 5, 10, 15, 20
 *   - the multiples of 3 within the range 10 to 20 are 12, 15, 18
 *
 * @param {number} multiplesOf The integer to find multiples of
 * @param {number} startRange The integer at the start of the range
 * @param {number} endRange The integer at the end of the range
 * @returns {number[]} An array of all the multiples
 */
export declare const multiplesWithinRange: (multiplesOf: number, startRange: number, endRange: number) => number[];
