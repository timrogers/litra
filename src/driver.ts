import HID from 'node-hid';

import { integerToBytes, padRight, percentageWithinRange } from './utils';

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
  [DeviceType.LitraBeam]: 20,
};

const MAXIMUM_BRIGHTNESS_IN_LUMEN_BY_DEVICE_TYPE = {
  [DeviceType.LitraGlow]: 250,
  [DeviceType.LitraBeam]: 400,
};

const MINIMUM_TEMPERATURE_IN_KELVIN_BY_DEVICE_TYPE = {
  [DeviceType.LitraGlow]: 2700,
  [DeviceType.LitraBeam]: 2700,
};

const MAXIMUM_TEMPERATURE_IN_KELVIN_BY_DEVICE_TYPE = {
  [DeviceType.LitraGlow]: 6500,
  [DeviceType.LitraBeam]: 6500,
};

// Conforms to the interface of `node-hid`'s `HID.HID`. Useful for mocking.
export interface Device {
  hid: {
    write: (values: number[] | Buffer) => number;
  };
  type: DeviceType;
}

/**
 * Finds your Logitech Litra device and returns it. Returns `null` if a
 * supported device cannot be found connected to your computer.
 *
 * @returns {Device, null} An object representing your Logitech Litra device,
 * passed into other functions like `turnOn` and `setTemperatureInKelvin` -
 * or `null` if a matching device cannot be found connected to your computer.
 */
export const findDevice = (): Device | null => {
  const matchingDevice = HID.devices().find(
    (device) =>
      device.vendorId === VENDOR_ID &&
      PRODUCT_IDS.includes(device.productId) &&
      device.usagePage === USAGE_PAGE,
  );

  if (matchingDevice) {
    return {
      type: getDeviceTypeByProductId(matchingDevice.productId),
      hid: new HID.HID(matchingDevice.path as string),
    };
  } else {
    return null;
  }
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
 * @param {number} temperatureInKelvin The temperature to set in Kelvin. Use the
 *  `getMinimumTemperatureInKelvinForDevice` and `getMaximumTemperatureInKelvinForDevice`
 *  functions to get the minimum and maximum temperature for your device.
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

  if (
    temperatureInKelvin < minimumTemperature ||
    temperatureInKelvin > maximumTemperature
  ) {
    throw `Provided temperature must be between ${minimumTemperature} and ${maximumTemperature} for this device`;
  }

  device.hid.write(
    padRight([0x11, 0xff, 0x04, 0x9c, ...integerToBytes(temperatureInKelvin)], 20, 0x00),
  );
};

/**
 * Set the temperature of your Logitech Litra device to a percentage
 * of the device's maximum temperature
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} temperaturePercentage The percentage to set the temperature to
 */
export const setTemperaturePercentage = (
  device: Device,
  temperaturePercentage: number,
): void => {
  if (temperaturePercentage < 0 || temperaturePercentage > 100) {
    throw 'Percentage must be between 0 and 100';
  }

  const minimumTemperature = getMinimumTemperatureInKelvinForDevice(device);
  const maximumTemperature = getMaximumTemperatureInKelvinForDevice(device);

  return setTemperatureInKelvin(
    device,
    temperaturePercentage === 0
      ? minimumTemperature
      : percentageWithinRange(
          temperaturePercentage,
          minimumTemperature,
          maximumTemperature,
        ),
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
  return MINIMUM_TEMPERATURE_IN_KELVIN_BY_DEVICE_TYPE[device.type];
};

/**
 * Gets the maximum temperature in Kelvin supported by a device
 *
 * @param {Device} device The device to check the maximum temperature for
 * @returns {number} The maximum temperature in Kelvin supported by the device
 */
export const getMaximumTemperatureInKelvinForDevice = (device: Device): number => {
  return MAXIMUM_TEMPERATURE_IN_KELVIN_BY_DEVICE_TYPE[device.type];
};
