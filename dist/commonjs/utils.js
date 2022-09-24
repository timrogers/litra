"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percentageWithinRange = exports.integerToBytes = exports.padRight = void 0;
/**
 * Pads the provided array to a specified length, adding the required
 * number of occurences of the padding element to the end of the array.
 *
 * @param {any[]} array The array to pad
 * @param {number} length The required length for the array after padding
 * @param {any} paddingElement The element to pad the array with
 * @returns {any[]} The array padded to the required length
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const padRight = (array, length, paddingElement) => {
    if (array.length >= length) {
        return array;
    }
    return [
        ...array,
        ...Array(length - array.length)
            .fill([paddingElement])
            .flat(),
    ];
};
exports.padRight = padRight;
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
const integerToBytes = (integer) => {
    if (!Number.isInteger(integer)) {
        throw 'Provided value must be an integer';
    }
    return [Math.trunc(integer / 256), integer % 256];
};
exports.integerToBytes = integerToBytes;
/**
 * Finds a given percentage within a range - for example, the 50% marker
 * in the range 0 to 200 is 100.
 *
 * @param {number} percentage The percentage to find within the range
 * @param {number} startRange The number at the start of the range
 * @param {number} endRange The number at the end of the range
 * @returns {number} The value at the given percentage
 */
const percentageWithinRange = (percentage, startRange, endRange) => {
    return Math.round(Math.ceil(((percentage - 1) / (100 - 1)) * (endRange - startRange) + startRange));
};
exports.percentageWithinRange = percentageWithinRange;
