"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameForDevice = exports.getAllowedTemperaturesInKelvinForDevice = exports.getMaximumTemperatureInKelvinForDevice = exports.getMinimumTemperatureInKelvinForDevice = exports.getMaximumBrightnessInLumenForDevice = exports.getMinimumBrightnessInLumenForDevice = exports.setBrightnessPercentage = exports.getBrightnessInLumen = exports.setBrightnessInLumen = exports.getTemperatureInKelvin = exports.setTemperatureInKelvin = exports.isOn = exports.toggle = exports.turnOff = exports.turnOn = exports.findDevices = exports.findDevice = exports.DeviceType = void 0;
const node_hid_1 = __importDefault(require("node-hid"));
const utils_1 = require("./utils");
var DeviceType;
(function (DeviceType) {
    DeviceType["LitraGlow"] = "litra_glow";
    DeviceType["LitraBeam"] = "litra_beam";
})(DeviceType = exports.DeviceType || (exports.DeviceType = {}));
const VENDOR_ID = 0x046d;
const PRODUCT_IDS = [
    0xc900,
    0xc901, // Litra Beam
];
const USAGE_PAGE = 0xff43;
const MINIMUM_BRIGHTNESS_IN_LUMEN_BY_DEVICE_TYPE = {
    [DeviceType.LitraGlow]: 20,
    [DeviceType.LitraBeam]: 30,
};
const MAXIMUM_BRIGHTNESS_IN_LUMEN_BY_DEVICE_TYPE = {
    [DeviceType.LitraGlow]: 250,
    [DeviceType.LitraBeam]: 400,
};
const MULTIPLES_OF_100_BETWEEN_2700_AND_6500 = (0, utils_1.multiplesWithinRange)(100, 2700, 6500);
const ALLOWED_TEMPERATURES_IN_KELVIN_BY_DEVICE_TYPE = {
    [DeviceType.LitraGlow]: MULTIPLES_OF_100_BETWEEN_2700_AND_6500,
    [DeviceType.LitraBeam]: MULTIPLES_OF_100_BETWEEN_2700_AND_6500,
};
const NAME_BY_DEVICE_TYPE = {
    [DeviceType.LitraGlow]: 'Logitech Litra Glow',
    [DeviceType.LitraBeam]: 'Logitech Litra Beam',
};
const isLitraDevice = (device) => {
    return (device.vendorId === VENDOR_ID &&
        PRODUCT_IDS.includes(device.productId) &&
        device.usagePage === USAGE_PAGE);
};
const hidDeviceToDevice = (hidDevice) => {
    return {
        type: getDeviceTypeByProductId(hidDevice.productId),
        hid: new node_hid_1.default.HID(hidDevice.path),
        serialNumber: hidDevice.serialNumber,
    };
};
/**
 * Finds your Logitech Litra device and returns it. Returns `null` if a
 * supported device cannot be found connected to your computer.
 *
 * @returns {Device, null} An object representing your Logitech Litra device,
 * passed into other functions like `turnOn` and `setTemperatureInKelvin` -
 * or `null` if a matching device cannot be found connected to your computer.
 */
const findDevice = () => {
    const matchingDevice = node_hid_1.default.devices().find(isLitraDevice);
    if (matchingDevice) {
        return hidDeviceToDevice(matchingDevice);
    }
    else {
        return null;
    }
};
exports.findDevice = findDevice;
/**
 * Finds one or more Logitech Litra devices and returns them.
 * Returns an empty `Array` if no supported devices could be found
 * connected to your computer.
 *
 * @returns {Device[], null} An Array representing your Logitech Litra devices,
 * passed into other functions like `turnOn` and `setTemperatureInKelvin`. The
 * Array will be empty if no matching devices could be found connected to your computer.
 */
const findDevices = () => {
    const matchingDevices = node_hid_1.default.devices().filter(isLitraDevice);
    return matchingDevices.map(hidDeviceToDevice);
};
exports.findDevices = findDevices;
/**
 * Turns your Logitech Litra device on
 *
 * @param {Device} device The device to turn on
 */
const turnOn = (device) => {
    device.hid.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x1c, 0x01], 20, 0x00));
};
exports.turnOn = turnOn;
/**
 * Turns your Logitech Litra device off
 *
 * @param {Device} device The device to turn off
 */
const turnOff = (device) => {
    device.hid.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x1c, 0x00], 20, 0x00));
};
exports.turnOff = turnOff;
/**
 * Toggles your Logitech Litra device on or off
 *
 * @param {Device} device The device to toggle on or off
 */
const toggle = (device) => {
    if ((0, exports.isOn)(device)) {
        (0, exports.turnOff)(device);
    }
    else {
        (0, exports.turnOn)(device);
    }
};
exports.toggle = toggle;
/**
 * Gets the current power state of your Logitech Litra device
 *
 * @param {Device} device The device to get the current power state for
 * @returns {boolean} Current power state where true = on and false = off
 */
const isOn = (device) => {
    device.hid.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x01], 20, 0x00));
    const data = device.hid.readSync();
    return data[4] === 1;
};
exports.isOn = isOn;
/**
 * Sets the temperature of your Logitech Litra device
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} temperatureInKelvin The temperature to set in Kelvin. Only
 *   multiples of 100 between the device's minimum and maximum temperatures
 *   are allowed. Use the `getMinimumTemperatureInKelvinForDevice` and
 *   `getMaximumTemperatureInKelvinForDevice` functions to get the minimum
 *   and maximum temperature for your device.
 */
const setTemperatureInKelvin = (device, temperatureInKelvin) => {
    if (!Number.isInteger(temperatureInKelvin)) {
        throw 'Provided temperature must be an integer';
    }
    const minimumTemperature = (0, exports.getMinimumTemperatureInKelvinForDevice)(device);
    const maximumTemperature = (0, exports.getMaximumTemperatureInKelvinForDevice)(device);
    const allowedTemperatures = (0, exports.getAllowedTemperaturesInKelvinForDevice)(device);
    if (!allowedTemperatures.includes(temperatureInKelvin)) {
        throw `Provided temperature must be a multiple of 100 between ${minimumTemperature} and ${maximumTemperature} for this device`;
    }
    device.hid.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x9c, ...(0, utils_1.integerToBytes)(temperatureInKelvin)], 20, 0x00));
};
exports.setTemperatureInKelvin = setTemperatureInKelvin;
/**
 * Gets the temperature of your Logitech Litra device
 *
 * @param {Device} device The device to get the temperature for
 * @returns {number} The current temperature in Kelvin
 */
const getTemperatureInKelvin = (device) => {
    device.hid.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x81], 20, 0x00));
    const data = device.hid.readSync();
    // data[4] is the multiple of 256
    // data[5] is the remainder of 256
    // together they come out to the temp in K
    return data[4] * 256 + data[5];
};
exports.getTemperatureInKelvin = getTemperatureInKelvin;
/**
 * Sets the brightness of your Logitech Litra device, measured in Lumen
 *
 * @param {Device} device The device to set the brightness of
 * @param {number} brightnessInLumen The brightness to set in Lumen. Use the
 *  `getMinimumBrightnessInLumenForDevice` and `getMaximumBrightnessInLumenForDevice`
 *  functions to get the minimum and maximum brightness for your device.
 */
const setBrightnessInLumen = (device, brightnessInLumen) => {
    if (!Number.isInteger(brightnessInLumen)) {
        throw 'Provided brightness must be an integer';
    }
    const minimumBrightness = (0, exports.getMinimumBrightnessInLumenForDevice)(device);
    const maximumBrightness = (0, exports.getMaximumBrightnessInLumenForDevice)(device);
    if (brightnessInLumen < minimumBrightness || brightnessInLumen > maximumBrightness) {
        throw `Provided brightness must be between ${minimumBrightness} and ${maximumBrightness} for this device`;
    }
    device.hid.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x4c, ...(0, utils_1.integerToBytes)(brightnessInLumen)], 20, 0x00));
};
exports.setBrightnessInLumen = setBrightnessInLumen;
/**
 * Gets the current brightness of your Logitech Litra device, measured in Lumen
 *
 * @param {Device} device The device to get the current brightness for
 * @returns {number} The current brightness in Lumen
 */
const getBrightnessInLumen = (device) => {
    device.hid.write((0, utils_1.padRight)([0x11, 0xff, 0x04, 0x31], 20, 0x00));
    const data = device.hid.readSync();
    return data[5];
};
exports.getBrightnessInLumen = getBrightnessInLumen;
/**
 * Set the brightness of your Logitech Litra device to a percentage
 * of the device's maximum brightness
 *
 * @param {Device} device The device to set the brightness of
 * @param {number} brightnessPercentage The percentage to set the brightness to
 */
const setBrightnessPercentage = (device, brightnessPercentage) => {
    if (brightnessPercentage < 0 || brightnessPercentage > 100) {
        throw 'Percentage must be between 0 and 100';
    }
    const minimumBrightness = (0, exports.getMinimumBrightnessInLumenForDevice)(device);
    const maximumBrightness = (0, exports.getMaximumBrightnessInLumenForDevice)(device);
    return (0, exports.setBrightnessInLumen)(device, brightnessPercentage === 0
        ? minimumBrightness
        : (0, utils_1.percentageWithinRange)(brightnessPercentage, minimumBrightness, maximumBrightness));
};
exports.setBrightnessPercentage = setBrightnessPercentage;
/**
 * Gets the type of a Logitech Litra device by its product IOD
 *
 * @param {number} productId The product ID of the device
 * @returns {DeviceType} The type of the device
 */
const getDeviceTypeByProductId = (productId) => {
    switch (productId) {
        case 0xc900:
            return DeviceType.LitraGlow;
        case 0xc901:
            return DeviceType.LitraBeam;
        default:
            throw 'Unknown device type';
    }
};
/**
 * Gets the minimum brightness in Lumen supported by a device
 *
 * @param {Device} device The device to check the minimum brightness for
 * @returns {number} The minimum brightness in Lumen supported by the device
 */
const getMinimumBrightnessInLumenForDevice = (device) => {
    return MINIMUM_BRIGHTNESS_IN_LUMEN_BY_DEVICE_TYPE[device.type];
};
exports.getMinimumBrightnessInLumenForDevice = getMinimumBrightnessInLumenForDevice;
/**
 * Gets the maximum brightness in Lumen supported by a device
 *
 * @param {Device} device The device to check the maximum brightness for
 * @returns {number} The maximum brightness in Lumen supported by the device
 */
const getMaximumBrightnessInLumenForDevice = (device) => {
    return MAXIMUM_BRIGHTNESS_IN_LUMEN_BY_DEVICE_TYPE[device.type];
};
exports.getMaximumBrightnessInLumenForDevice = getMaximumBrightnessInLumenForDevice;
/**
 * Gets the minimum temperature in Kelvin supported by a device
 *
 * @param {Device} device The device to check the minimum temperature for
 * @returns {number} The minimum temperature in Kelvin supported by the device
 */
const getMinimumTemperatureInKelvinForDevice = (device) => {
    return ALLOWED_TEMPERATURES_IN_KELVIN_BY_DEVICE_TYPE[device.type][0];
};
exports.getMinimumTemperatureInKelvinForDevice = getMinimumTemperatureInKelvinForDevice;
/**
 * Gets the maximum temperature in Kelvin supported by a device
 *
 * @param {Device} device The device to check the maximum temperature for
 * @returns {number} The maximum temperature in Kelvin supported by the device
 */
const getMaximumTemperatureInKelvinForDevice = (device) => {
    const allowedTemperatures = ALLOWED_TEMPERATURES_IN_KELVIN_BY_DEVICE_TYPE[device.type];
    return allowedTemperatures[allowedTemperatures.length - 1];
};
exports.getMaximumTemperatureInKelvinForDevice = getMaximumTemperatureInKelvinForDevice;
/**
 * Gets all temperature values in Kelvin supported by a device
 *
 * @param {Device} device The device to check the allowed temperatures for
 * @returns {number[]} The temperature values in Kelvin supported by the device
 */
const getAllowedTemperaturesInKelvinForDevice = (device) => {
    return ALLOWED_TEMPERATURES_IN_KELVIN_BY_DEVICE_TYPE[device.type];
};
exports.getAllowedTemperaturesInKelvinForDevice = getAllowedTemperaturesInKelvinForDevice;
/**
 * Gets the name of a device
 *
 * @param {Device} device The device to get the name for
 * @returns {string} The name of the device, e.g. "Logitech Litra Glow"
 */
const getNameForDevice = (device) => {
    return NAME_BY_DEVICE_TYPE[device.type];
};
exports.getNameForDevice = getNameForDevice;
