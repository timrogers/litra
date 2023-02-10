"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceForCLI = exports.parseIntOption = exports.sleep = void 0;
const commander = __importStar(require("commander"));
const driver_1 = require("../driver");
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
const sleep = (timeInMilliseconds) => new Promise((resolve) => setTimeout(resolve, timeInMilliseconds));
exports.sleep = sleep;
/**
 * Validates and parses an integer option for `Commander`, checking that the input is an integer
 * and casting it. Throws an error if the option value is not an integer.
 *
 * @param {string} value The option value passed through the command line
 * @returns {number} The option value parsed as an integer
 */
const parseIntOption = (value) => {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
        throw new commander.InvalidArgumentError('The value must be an integer.');
    }
    return parsedValue;
};
exports.parseIntOption = parseIntOption;
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
const getDeviceForCLI = (serialNumber) => {
    const devices = (0, driver_1.findDevices)();
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
exports.getDeviceForCLI = getDeviceForCLI;
