/// <reference types="node" />
export declare enum DeviceType {
    LitraGlow = "litra_glow",
    LitraBeam = "litra_beam"
}
export interface Device {
    hid: {
        write: (values: number[] | Buffer) => number;
        readSync(): number[];
    };
    type: DeviceType;
    serialNumber: string;
}
/**
 * Finds your Logitech Litra device and returns it. Returns `null` if a
 * supported device cannot be found connected to your computer.
 *
 * @returns {Device, null} An object representing your Logitech Litra device,
 * passed into other functions like `turnOn` and `setTemperatureInKelvin` -
 * or `null` if a matching device cannot be found connected to your computer.
 */
export declare const findDevice: () => Device | null;
/**
 * Finds one or more Logitech Litra devices and returns them.
 * Returns an empty `Array` if no supported devices could be found
 * connected to your computer.
 *
 * @returns {Device[], null} An Array representing your Logitech Litra devices,
 * passed into other functions like `turnOn` and `setTemperatureInKelvin`. The
 * Array will be empty if no matching devices could be found connected to your computer.
 */
export declare const findDevices: () => Device[];
/**
 * Turns your Logitech Litra device on
 *
 * @param {Device} device The device to turn on
 */
export declare const turnOn: (device: Device) => void;
/**
 * Turns your Logitech Litra device off
 *
 * @param {Device} device The device to turn off
 */
export declare const turnOff: (device: Device) => void;
/**
 * Toggles your Logitech Litra device on or off
 *
 * @param {Device} device The device to toggle on or off
 */
export declare const toggle: (device: Device) => void;
/**
 * Gets the current power state of your Logitech Litra device
 *
 * @param {Device} device The device to get the current power state for
 * @returns {boolean} Current power state where true = on and false = off
 */
export declare const isOn: (device: Device) => boolean;
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
export declare const setTemperatureInKelvin: (device: Device, temperatureInKelvin: number) => void;
/**
 * Gets the temperature of your Logitech Litra device
 *
 * @param {Device} device The device to get the temperature for
 * @returns {number} The current temperature in Kelvin
 */
export declare const getTemperatureInKelvin: (device: Device) => number;
/**
 * Sets the brightness of your Logitech Litra device, measured in Lumen
 *
 * @param {Device} device The device to set the brightness of
 * @param {number} brightnessInLumen The brightness to set in Lumen. Use the
 *  `getMinimumBrightnessInLumenForDevice` and `getMaximumBrightnessInLumenForDevice`
 *  functions to get the minimum and maximum brightness for your device.
 */
export declare const setBrightnessInLumen: (device: Device, brightnessInLumen: number) => void;
/**
 * Gets the current brightness of your Logitech Litra device, measured in Lumen
 *
 * @param {Device} device The device to get the current brightness for
 * @returns {number} The current brightness in Lumen
 */
export declare const getBrightnessInLumen: (device: Device) => number;
/**
 * Set the brightness of your Logitech Litra device to a percentage
 * of the device's maximum brightness
 *
 * @param {Device} device The device to set the brightness of
 * @param {number} brightnessPercentage The percentage to set the brightness to
 */
export declare const setBrightnessPercentage: (device: Device, brightnessPercentage: number) => void;
/**
 * Gets the minimum brightness in Lumen supported by a device
 *
 * @param {Device} device The device to check the minimum brightness for
 * @returns {number} The minimum brightness in Lumen supported by the device
 */
export declare const getMinimumBrightnessInLumenForDevice: (device: Device) => number;
/**
 * Gets the maximum brightness in Lumen supported by a device
 *
 * @param {Device} device The device to check the maximum brightness for
 * @returns {number} The maximum brightness in Lumen supported by the device
 */
export declare const getMaximumBrightnessInLumenForDevice: (device: Device) => number;
/**
 * Gets the minimum temperature in Kelvin supported by a device
 *
 * @param {Device} device The device to check the minimum temperature for
 * @returns {number} The minimum temperature in Kelvin supported by the device
 */
export declare const getMinimumTemperatureInKelvinForDevice: (device: Device) => number;
/**
 * Gets the maximum temperature in Kelvin supported by a device
 *
 * @param {Device} device The device to check the maximum temperature for
 * @returns {number} The maximum temperature in Kelvin supported by the device
 */
export declare const getMaximumTemperatureInKelvinForDevice: (device: Device) => number;
/**
 * Gets all temperature values in Kelvin supported by a device
 *
 * @param {Device} device The device to check the allowed temperatures for
 * @returns {number[]} The temperature values in Kelvin supported by the device
 */
export declare const getAllowedTemperaturesInKelvinForDevice: (device: Device) => number[];
/**
 * Gets the name of a device
 *
 * @param {Device} device The device to get the name for
 * @returns {string} The name of the device, e.g. "Logitech Litra Glow"
 */
export declare const getNameForDevice: (device: Device) => string;
