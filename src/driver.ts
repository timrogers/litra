import HID from 'node-hid';

import { integerToBytes, padRight, percentageWithinRange } from './utils';

const VENDOR_ID = 0x046d;
const PRODUCT_ID = 0xc900;
const USAGE_PAGE = 0xff43;

// Conforms to the interface of `node-hid`'s `HID.HID`. Useful for mocking.
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
export const findDevice = (): Device => {
  const matchingDevice = HID.devices().find(
    (device) =>
      device.vendorId === VENDOR_ID &&
      device.productId === PRODUCT_ID &&
      device.usagePage === USAGE_PAGE,
  );

  if (matchingDevice) {
    return new HID.HID(matchingDevice.path as string);
  } else {
    throw 'Device not found';
  }
};

/**
 * Turns your Logitech Litra Glow device on.
 *
 * @param {Device} device The device to set the temperature of
 */
export const turnOn = (device: Device): void => {
  device.write(padRight([0x11, 0xff, 0x04, 0x1c, 0x01], 20, 0x00));
};

/**
 * Turns your Logitech Litra Glow device off.
 *
 * @param {Device} device The device to set the temperature of
 */
export const turnOff = (device: Device): void => {
  device.write(padRight([0x11, 0xff, 0x04, 0x1c, 0x00], 20, 0x00));
};

const MINIMUM_TEMPERATURE_IN_KELVIN = 2700;
const MAXIMUM_TEMPERATURE_IN_KELVIN = 6500;

/**
 * Sets the temperature of your Logitech Litra Glow device
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} temperatureInKelvin The temperature to set in Kelvin, which
 * must be an integer between 2700 and 6500
 */
export const setTemperatureInKelvin = (
  device: Device,
  temperatureInKelvin: number,
): void => {
  if (!Number.isInteger(temperatureInKelvin)) {
    throw 'Provided temperature must be an integer';
  }

  if (
    temperatureInKelvin < MINIMUM_TEMPERATURE_IN_KELVIN ||
    temperatureInKelvin > MAXIMUM_TEMPERATURE_IN_KELVIN
  ) {
    throw `Provided temperature must be between ${MINIMUM_TEMPERATURE_IN_KELVIN} and ${MAXIMUM_TEMPERATURE_IN_KELVIN}`;
  }

  device.write(
    padRight([0x11, 0xff, 0x04, 0x9c, ...integerToBytes(temperatureInKelvin)], 20, 0x00),
  );
};

/**
 * Set the temperature of your Logitech Litra Glow device to a percentage
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

  return setTemperatureInKelvin(
    device,
    temperaturePercentage === 0
      ? MINIMUM_TEMPERATURE_IN_KELVIN
      : percentageWithinRange(
          temperaturePercentage,
          MINIMUM_TEMPERATURE_IN_KELVIN,
          MAXIMUM_TEMPERATURE_IN_KELVIN,
        ),
  );
};

const MINIMUM_BRIGHTNESS_IN_LUMEN = 20;
const MAXIMUM_BRIGHTNESS_IN_LUMEN = 250;

/**
 * Sets the brightness of your Logitech Litra Glow device, measured in Lumen
 *
 * @param {Device} device The device to set the temperature of
 * @param {number} brightnessInLumens The brightness to set in Lumen, which
 * must be an integer between 20 and 250
 */
export const setBrightnessInLumen = (device: Device, brightnessInLumen: number): void => {
  if (!Number.isInteger(brightnessInLumen)) {
    throw 'Provided brightness must be an integer';
  }

  if (
    brightnessInLumen < MINIMUM_BRIGHTNESS_IN_LUMEN ||
    brightnessInLumen > MAXIMUM_BRIGHTNESS_IN_LUMEN
  ) {
    throw `Provided brightness must be between ${MINIMUM_BRIGHTNESS_IN_LUMEN} and ${MAXIMUM_BRIGHTNESS_IN_LUMEN}`;
  }

  device.write(padRight([0x11, 0xff, 0x04, 0x4c, 0x00, brightnessInLumen], 20, 0x00));
};

/**
 * Set the brightness of your Logitech Litra Glow device to a percentage
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

  return setBrightnessInLumen(
    device,
    brightnessPercentage === 0
      ? MINIMUM_BRIGHTNESS_IN_LUMEN
      : percentageWithinRange(
          brightnessPercentage,
          MINIMUM_BRIGHTNESS_IN_LUMEN,
          MAXIMUM_BRIGHTNESS_IN_LUMEN,
        ),
  );
};
