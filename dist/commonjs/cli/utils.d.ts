import { Device } from '../driver';
/**
 * Returns a `Promise` that resolves after `timeInMilliseconds` milliseconds. This can be
 * used with `await` or `.then()` to sleep for a set period of time.
 * @returns {Promise<void>} A `Promise` that resolves after `timeInMilliseconds` milliseconds
 */
export declare const sleep: (timeInMilliseconds: number) => Promise<void>;
/**
 * Validates and parses an integer option for `Commander`, checking that the input is an integer
 * and casting it. Throws an error if the option value is not an integer.
 *
 * @param {string} value The option value passed through the command line
 * @returns {number} The option value parsed as an integer
 */
export declare const parseIntOption: (value: string) => number;
/**
 * Picks the device to use when a CLI is called, either picking any available
 * device or looking for a specific serial number if provided.
 *
 * Throws an error if a device is not found. Logs if multiple devices are found
 * and no serial number was provided, as in this case, inconsistent devices may
 * be returned between calls.
 *
 * @param {string | undefined} serialNumber The serial number of the device you're looking for
 * @returns {Device} The device to use for the CLI run
 */
export declare const getDeviceForCLI: (serialNumber: string | undefined) => Device;
