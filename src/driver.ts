import HID from 'node-hid';

import {
  integerToBytes,
  multiplesWithinRange,
  padRight,
  percentageWithinRange,
} from './utils';

export enum DeviceType {
  LitraGlow = 'litra_glow',
  LitraBeam = 'litra_beam',
}

const VENDOR_ID = 0x046d;
const PRODUCT_IDS = [
  0xc900, // Litra Glow
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

const MULTIPLES_OF_100_BETWEEN_2700_AND_6500 = multiplesWithinRange(100, 2700, 6500);

const ALLOWED_TEMPERATURES_IN_KELVIN_BY_DEVICE_TYPE = {
  [DeviceType.LitraGlow]: MULTIPLES_OF_100_BETWEEN_2700_AND_6500,
  [DeviceType.LitraBeam]: MULTIPLES_OF_100_BETWEEN_2700_AND_6500,
};

const NAME_BY_DEVICE_TYPE = {
  [DeviceType.LitraGlow]: 'Logitech Litra Glow',
  [DeviceType.LitraBeam]: 'Logitech Litra Beam',
};

// Conforms to the interface of `node-hid`'s `HID.HID`. Useful for mocking.
export interface Device {
  hid: {
    write: (values: number[] | Buffer) => number;
  };
  type: DeviceType;
  serialNumber: string;
}

const isLitraDevice = (device: HID.Device): boolean => {
  return (
    device.vendorId === VENDOR_ID &&
    PRODUCT_IDS.includes(device.productId) &&
    device.usagePage === USAGE_PAGE
  );
};

const hidDeviceToDevice = (hidDevice: HID.Device): Device => {
  return {
    type: getDeviceTypeByProductId(hidDevice.productId),
    hid: new HID.HID(hidDevice.path as string),
    serialNumber: hidDevice.serialNumber as string,
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
export const findDevice = (): Device | null => {
  const matchingDevice = HID.devices().find(isLitraDevice);

  if (matchingDevice) {
    return hidDeviceToDevice(matchingDevice);
  } else {
    return null;
  }
};

/**
 * Finds one or more Logitech Litra devices and returns them.
 * Returns an empty `Array` if no supported devices could be found
 * connected to your computer.
 *
 * @returns {Device[], null} An Array representing your Logitech Litra devices,
 * passed into other functions like `turnOn` and `setTemperatureInKelvin`. The
 * Array will be empty if no matching devices could be found connected to your computer.
 */
export const findDevices = (): Device[] => {
  const matchingDevices = HID.devices().filter(isLitraDevice);
  return matchingDevices.map(hidDeviceToDevice);
};

/**
 * Turns your Logitech Litra device on.
 *
 * @param {Device} device The device to set the temperature of
 */
export const turnOn = (device: Device): void => {
  device.hid.write(padRight([0x11, 0xff, 0x04, 0x1c, 0x01], 20, 0x00));
};

/**
 * Turns your Logitech Litra device off.
 *
 * @param {Device} device The device to set the temperature of
 */
export const turnOff = (device: Device): void => {
  device.hid.write(padRight([0x11, 0xff, 0x04, 0x1c, 0x00], 20, 0x00));
};

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
export const setTemperatureInKelvin = (
  device: Device,
  temperatureInKelvin: number,
): void => {
  if (!Number.isInteger(temperatureInKelvin)) {
    throw 'Provided temperature must be an integer';
  }

  const minimumTemperature = getMinimumTemperatureInKelvinForDevice(device);
  const maximumTemperature = getMaximumTemperatureInKelvinForDevice(device);
  const allowedTemperatures = getAllowedTemperaturesInKelvinForDevice(device);

  if (!allowedTemperatures.includes(temperatureInKelvin)) {
    throw `Provided temperature must be a multiple of 100 between ${minimumTemperature} and ${maximumTemperature} for this device`;
  }

  device.hid.write(
    padRight([0x11, 0xff, 0x04, 0x9c, ...integerToBytes(temperatureInKelvin)], 20, 0x00),
  );
};

/**
 * Sets the brightness of your Logitech Litra device, measured in Lumen
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} brightnessInLumen The brightness to set in Lumen. Use the
 *  `getMinimumBrightnessInLumenForDevice` and `getMaximumBrightnessInLumenForDevice`
 *  functions to get the minimum and maximum brightness for your device.
 */
export const setBrightnessInLumen = (device: Device, brightnessInLumen: number): void => {
  if (!Number.isInteger(brightnessInLumen)) {
    throw 'Provided brightness must be an integer';
  }

  const minimumBrightness = getMinimumBrightnessInLumenForDevice(device);
  const maximumBrightness = getMaximumBrightnessInLumenForDevice(device);

  if (brightnessInLumen < minimumBrightness || brightnessInLumen > maximumBrightness) {
    throw `Provided brightness must be between ${minimumBrightness} and ${maximumBrightness} for this device`;
  }

  device.hid.write(padRight([0x11, 0xff, 0x04, 0x4c, 0x00, brightnessInLumen], 20, 0x00));
};

/**
 * Set the brightness of your Logitech Litra device to a percentage
 * of the device's maximum brightness
 *
 * @param {Device} device The device to set the brightness of
 * @param {number} brightnessPercentage The percentage to set the brightness to
 */
export const setBrightnessPercentage = (
  device: Device,
  brightnessPercentage: number,
): void => {
  if (brightnessPercentage < 0 || brightnessPercentage > 100) {
    throw 'Percentage must be between 0 and 100';
  }

  const minimumBrightness = getMinimumBrightnessInLumenForDevice(device);
  const maximumBrightness = getMaximumBrightnessInLumenForDevice(device);

  return setBrightnessInLumen(
    device,
    brightnessPercentage === 0
      ? minimumBrightness
      : percentageWithinRange(brightnessPercentage, minimumBrightness, maximumBrightness),
  );
};

/**
 * Gets the type of a Logitech Litra device by its product IOD
 *
 * @param {number} productId The product ID of the device
 * @returns {DeviceType} The type of the device
 */
const getDeviceTypeByProductId = (productId: number): DeviceType => {
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
export const getMinimumBrightnessInLumenForDevice = (device: Device): number => {
  return MINIMUM_BRIGHTNESS_IN_LUMEN_BY_DEVICE_TYPE[device.type];
};

/**
 * Gets the maximum brightness in Lumen supported by a device
 *
 * @param {Device} device The device to check the maximum brightness for
 * @returns {number} The maximum brightness in Lumen supported by the device
 */
export const getMaximumBrightnessInLumenForDevice = (device: Device): number => {
  return MAXIMUM_BRIGHTNESS_IN_LUMEN_BY_DEVICE_TYPE[device.type];
};

/**
 * Gets the minimum temperature in Kelvin supported by a device
 *
 * @param {Device} device The device to check the minimum temperature for
 * @returns {number} The minimum temperature in Kelvin supported by the device
 */
export const getMinimumTemperatureInKelvinForDevice = (device: Device): number => {
  return ALLOWED_TEMPERATURES_IN_KELVIN_BY_DEVICE_TYPE[device.type][0];
};

/**
 * Gets the maximum temperature in Kelvin supported by a device
 *
 * @param {Device} device The device to check the maximum temperature for
 * @returns {number} The maximum temperature in Kelvin supported by the device
 */
export const getMaximumTemperatureInKelvinForDevice = (device: Device): number => {
  const allowedTemperatures = ALLOWED_TEMPERATURES_IN_KELVIN_BY_DEVICE_TYPE[device.type];
  return allowedTemperatures[allowedTemperatures.length - 1];
};

/**
 * Gets all temperature values in Kelvin supported by a device
 *
 * @param {Device} device The device to check the allowed temperatures for
 * @returns {number[]} The temperature values in Kelvin supported by the device
 */
const getAllowedTemperaturesInKelvinForDevice = (device: Device): number[] => {
  return ALLOWED_TEMPERATURES_IN_KELVIN_BY_DEVICE_TYPE[device.type];
};

/**
 * Gets the name of a device
 *
 * @param {Device} device The device to get the name for
 * @returns {string} The name of the device, e.g. "Logitech Litra Glow"
 */
export const getNameForDevice = (device: Device): string => {
  return NAME_BY_DEVICE_TYPE[device.type];
};
