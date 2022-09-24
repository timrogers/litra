"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBrightnessPercentage = exports.setBrightnessInLumen = exports.setTemperaturePercentage = exports.setTemperatureInKelvin = exports.turnOff = exports.turnOn = exports.findDevice = void 0;
const node_hid_1 = __importDefault(require("node-hid"));
const utils_1 = require("./utils");
const VENDOR_ID = 0x046d;
const PRODUCT_ID = 0xc900;
/**
 * Finds your Logitech Litra Glow device and returns it. Throws an
 * error if a matching device cannot be found connected to your
 * computer.
 *
 * @returns {Device} An object representing your Logitech Litra Glow
 * device, passed into other functions like `turnOn` and
 * `setTemperatureInKelvin`
 */
const findDevice = () => new node_hid_1.default.HID(VENDOR_ID, PRODUCT_ID);
exports.findDevice = findDevice;
/**
 * Turns your Logitech Litra Glow device on.
 *
 * @param {Device} device The device to set the temperature of
 */
const turnOn = (device) => {
    device.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x1c, 0x01], 20, 0x00));
};
exports.turnOn = turnOn;
/**
 * Turns your Logitech Litra Glow device off.
 *
 * @param {Device} device The device to set the temperature of
 */
const turnOff = (device) => {
    device.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x1c, 0x00], 20, 0x00));
};
exports.turnOff = turnOff;
const MINIMUM_TEMPERATURE_IN_KELVIN = 2700;
const MAXIMUM_TEMPERATURE_IN_KELVIN = 6500;
/**
 * Sets the temperature of your Logitech Litra Glow device
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} temperatureInKelvin The temperature to set in Kelvin, which
 * must be an integer between 2700 and 6500
 */
const setTemperatureInKelvin = (device, temperatureInKelvin) => {
    if (!Number.isInteger(temperatureInKelvin)) {
        throw 'Provided temperature must be an integer';
    }
    if (temperatureInKelvin < MINIMUM_TEMPERATURE_IN_KELVIN ||
        temperatureInKelvin > MAXIMUM_TEMPERATURE_IN_KELVIN) {
        throw `Provided temperature must be between ${MINIMUM_TEMPERATURE_IN_KELVIN} and ${MAXIMUM_TEMPERATURE_IN_KELVIN}`;
    }
    device.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x9c, ...(0, utils_1.integerToBytes)(temperatureInKelvin)], 20, 0x00));
};
exports.setTemperatureInKelvin = setTemperatureInKelvin;
/**
 * Set the temperature of your Logitech Litra Glow device to a percentage
 * of the device's maximum temperature
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} temperaturePercentage The percentage to set the temperature to
 */
const setTemperaturePercentage = (device, temperaturePercentage) => {
    if (temperaturePercentage < 0 || temperaturePercentage > 100) {
        throw 'Percentage must be between 0 and 100';
    }
    return (0, exports.setTemperatureInKelvin)(device, temperaturePercentage === 0
        ? MINIMUM_TEMPERATURE_IN_KELVIN
        : (0, utils_1.percentageWithinRange)(temperaturePercentage, MINIMUM_TEMPERATURE_IN_KELVIN, MAXIMUM_TEMPERATURE_IN_KELVIN));
};
exports.setTemperaturePercentage = setTemperaturePercentage;
const MINIMUM_BRIGHTNESS_IN_LUMEN = 20;
const MAXIMUM_BRIGHTNESS_IN_LUMEN = 250;
/**
 * Sets the brightness of your Logitech Litra Glow device, measured in Lumen
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} brightnessInLumens The brightness to set in Lumen, which
 * must be an integer between 20 and 250
 */
const setBrightnessInLumen = (device, brightnessInLumen) => {
    if (!Number.isInteger(brightnessInLumen)) {
        throw 'Provided brightness must be an integer';
    }
    if (brightnessInLumen < MINIMUM_BRIGHTNESS_IN_LUMEN ||
        brightnessInLumen > MAXIMUM_BRIGHTNESS_IN_LUMEN) {
        throw `Provided brightness must be between ${MINIMUM_BRIGHTNESS_IN_LUMEN} and ${MAXIMUM_BRIGHTNESS_IN_LUMEN}`;
    }
    device.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x4c, 0x00, brightnessInLumen], 20, 0x00));
};
exports.setBrightnessInLumen = setBrightnessInLumen;
/**
 * Set the brightness of your Logitech Litra Glow device to a percentage
 * of the device's maximum brightness
 *
 * @param {Device} device The device to set the brightness of
 * @param {number} brightnessPercentage The percentage to set the brightness to
 */
const setBrightnessPercentage = (device, brightnessPercentage) => {
    if (brightnessPercentage < 0 || brightnessPercentage > 100) {
        throw 'Percentage must be between 0 and 100';
    }
    return (0, exports.setBrightnessInLumen)(device, brightnessPercentage === 0
        ? MINIMUM_BRIGHTNESS_IN_LUMEN
        : (0, utils_1.percentageWithinRange)(brightnessPercentage, MINIMUM_BRIGHTNESS_IN_LUMEN, MAXIMUM_BRIGHTNESS_IN_LUMEN));
};
exports.setBrightnessPercentage = setBrightnessPercentage;
