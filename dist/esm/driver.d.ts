/// <reference types="node" />
export interface Device {
    write: (values: number[] | Buffer) => number;
}
/**
 * Finds your Logitech Litra Glow device and returns it. Throws an
 * error if a matching device cannot be found connected to your
 * computer.
 *
 * @returns {Device} An object representing your Logitech Litra Glow
 * device, passed into other functions like `turnOn` and
 * `setTemperatureInKelvin`
 */
export declare const findDevice: () => Device;
/**
 * Turns your Logitech Litra Glow device on.
 *
 * @param {Device} device The device to set the temperature of
 */
export declare const turnOn: (device: Device) => void;
/**
 * Turns your Logitech Litra Glow device off.
 *
 * @param {Device} device The device to set the temperature of
 */
export declare const turnOff: (device: Device) => void;
/**
 * Sets the temperature of your Logitech Litra Glow device
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} temperatureInKelvin The temperature to set in Kelvin, which
 * must be an integer between 2700 and 6500
 */
export declare const setTemperatureInKelvin: (device: Device, temperatureInKelvin: number) => void;
/**
 * Set the temperature of your Logitech Litra Glow device to a percentage
 * of the device's maximum temperature
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} temperaturePercentage The percentage to set the temperature to
 */
export declare const setTemperaturePercentage: (device: Device, temperaturePercentage: number) => void;
/**
 * Sets the brightness of your Logitech Litra Glow device, measured in Lumen
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} brightnessInLumens The brightness to set in Lumen, which
 * must be an integer between 20 and 250
 */
export declare const setBrightnessInLumen: (device: Device, brightnessInLumen: number) => void;
/**
 * Set the brightness of your Logitech Litra Glow device to a percentage
 * of the device's maximum brightness
 *
 * @param {Device} device The device to set the brightness of
 * @param {number} brightnessPercentage The percentage to set the brightness to
 */
export declare const setBrightnessPercentage: (device: Device, brightnessPercentage: number) => void;
