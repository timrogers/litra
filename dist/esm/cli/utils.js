import * as commander from 'commander';
import { findDevices } from '../driver';
/**
 * Plucks a `Device` from an array of devices based on its serial number.
 *
 * @param {Device[]} devices
 * @param {string} requestedSerialNumber The serial number of the device you're looking for
 * @returns {Device | undefined} The device with the requested serial number, or `undefined`
 */
const getDeviceBySerialNumber = (devices, requestedSerialNumber) => devices.find((device) => device.serialNumber === requestedSerialNumber);
/**
 * Returns a `Promise` that resolves after `timeInMilliseconds` milliseconds. This can be
 * used with `await` or `.then()` to sleep for a set period of time.
 * @returns {Promise<void>} A `Promise` that resolves after `timeInMilliseconds` milliseconds
 */
export const sleep = (timeInMilliseconds) => new Promise((resolve) => setTimeout(resolve, timeInMilliseconds));
/**
 * Validates and parses an integer option for `Commander`, checking that the input is an integer
 * and casting it. Throws an error if the option value is not an integer.
 *
 * @param {string} value The option value passed through the command line
 * @returns {number} The option value parsed as an integer
 */
export const parseIntOption = (value) => {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
        throw new commander.InvalidArgumentError('The value must be an integer.');
    }
    return parsedValue;
};
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
export const getDeviceForCLI = (serialNumber) => {
    const devices = findDevices();
    const device = serialNumber
        ? getDeviceBySerialNumber(devices, serialNumber)
        : devices[0];
    if (device) {
        if (devices.length > 1 && !serialNumber) {
            console.warn(`⚠️ You have multiple devices connected, but you haven't specified the serial number of the device you want to target using \`-s\`. Using first identified device with serial number ${device.serialNumber}. This device is not guaranteed to be the same every time you run this command.`);
        }
        return device;
    }
    else {
        throw serialNumber
            ? `Device not found with serial number ${serialNumber}`
            : 'Device not found';
    }
};
