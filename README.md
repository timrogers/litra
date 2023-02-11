# Logitech Litra

This JavaScript driver allows you to control [Logitech Litra Glow](https://www.logitech.com/en-gb/products/lighting/litra-glow.946-000002.html) and [Logitech Litra Beam](https://www.logitech.com/en-gb/products/lighting/litra-beam.946-000007.html) lights using a CLI and from your JavaScript code.

With this driver, you can:

* Turn your light on and off
* Set the brightness of your light
* Set the temperature of your light

## Compatibility

This library is only tested on macOS Monterey (12.5). It's powered by [`node-hid`](https://github.com/node-hid/node-hid), which is compatible with other macOS versions, Windows and Linux, so it would be expected to work there too, but your milage may vary 🙏

## Using as a command line tool

Make sure you have Node.js available on your machine, and then install the package with `npm install -g litra`.

With the package installed:

* Use the `litra-on` and `litra-off` commands to turn your light on and off.
* Use the `litra-brightness` command to set your Litra's brightness to a percentage of its maximum (e.g. `litra-brightness 90`).
* Use the `litra-brightness-lm` command to set your Litra's brightness to a value in Lumen (e.g. `litra-brightness 250`).
* Use the `litra-temperature` command to set your Litra's temperature to a percentage of its maximum (e.g. `litra-temperature 75`).
* Use the `litra-temperature-k` command to set your Litra's temperature to a value in Kelvin (e.g. `litra-temperature-k 6500`).

All of the these commands support a `--serial-number`/`-s` argument to specify the serial number of the device you want to target. If you only have one Litra device, you can omit this argument. If you have multiple devices, we recommend specifying it. If it isn't specified, the "first" device will be picked, but this isn't guaranteed to be stable between command runs.

You can also use:

* `litra-devices` to list Litra devices connected to your machine, including in JSON format with `--json`
* `litra-identify` to interactively identify the serial numbers of your Litra devices, if you have multiple connected

Each CLI command can also be called with `--help` for more detailed documentation.

## Using as a JavaScript library

### Installation

Simply add the `litra` Node.js package to your `package.json` and install it:

```sh
npm install --save litra
```

### Usage

#### Checking if a Litra device is plugged in

The `findDevice` function checks your computer to find whether a Logitech Litra device is plugged in. 

If it is, it returns an object representing the device, which you can pass into other function. If it isn't, it returns `null`.

```js
import { findDevice } from 'litra';

const device = findDevice();

if (device) {
  console.log(`Found a ${device.type} device connected`);

  // Do something
} else {
  // Blow up
}
```

If you're a *huge* fan of Litra devices and you have multiple plugged in at the same time, use `findDevices` instead:

```js
const devices = findDevices();

if (devices.length > 0) {
  console.log(`Found ${devices.length} devices connected`);
  for (let i = 0; i < devices.length; ++i) {
    console.log(`Device ${i + 1}: ${devices[i].type}`);
  }

  // Do something
} else {
  // Blow up
}
```

#### Turning your Litra device on or off

Find your device with `findDevice`, and then use the simple `turnOn` and `turnOff` functions. They just take one parameter: the device.

```js
import { findDevice, turnOff, turnOn } from 'litra';

const device = findDevice();

// Turn your light on, then turn it off again after 5 seconds
if (device) {
  turnOn(device);
  setTimeout(() => turnOff(device), 5000));
}
```

#### Setting the brightness of your Litra device

You can set the brightness of your Litra device, measured in Lumen, using the `setBrightnessInLumen` function. 

The Litra Glow supports brightness between 20 and 250 Lumen. The Litra Beam supports brightness between 20 and 400 Lumen.

You can programatically check what brightness levels are supported by your device. Once you know what brightness levels are supported, you can set the brightness in Lumen. If you try to set a value that isn't allowed by your device, an error will be thrown:

```js
import { findDevice, getMaximumBrightnessInLumenForDevice, getMinimumBrightnessInLumenForDevice, setBrightnessInLumen } from 'litra';

const device = findDevice();

if (device) {
  const minimumBrightness = getMinimumBrightnessInLumenForDevice(device);
  const maximumBrightness = getMaximumBrightnessInLumenForDevice(device);

  console.log(`The minimum allowed brightness is ${minimumBrightness} and the maximum is ${maximumBrightness}`);

  setBrightnessInLumen(device, 150);
}
```

You can also set brightness level to a percentage with `setBrightnessPercentage` if you don't want to think in Lumen:

```js
import { findDevice, setBrightnessPercentage } from 'litra';

const device = findDevice();

if (device) {
  setBrightnessPercentage(device, 75);
}
```

#### Setting the temperature of your Litra device

You can set the temperature of your Litra device, measured in Kelvin, using the `setTemperatureInKelvin` function.

Both the Litra Glow and Litra Beam support temperatures between 2700 and 6500 Kelvin.

You can check programatically what temperature levels are supported by your device. Once you know what temperature levels are supported, you can set the temperature in Kelvin. If you try to set a value that isn't allowed by your device, an error will be thrown:

```js
import { findDevice, getMaximumTemperatureInKelvinForDevice, getMinimumTemperatureInKelvinForDevice, setTemperatureInKelvin } from 'litra';

const device = findDevice();

if (device) {
  const minimumTemperature = getMinimumTemperatureInKelvinForDevice(device);
  const maximumTemperature = getMaximumTemperatureInKelvinForDevice(device);

  console.log(`The minimum allowed temperature is ${minimumTemperature} and the maximum is ${maximumTemperature}`);

  setTemperatureInKelvin(device, 6500);
}
```

You can also set temperature level to a percentage with `setTemperaturePercentage` if you don't want to think in Kelvin:

```js
import { findDevice, setTemperaturePercentage } from 'litra';

const device = findDevice();

if (device) {
  setTemperaturePercentage(device, 75);
}
```

## Using with Oversight

Litra integrates with [Oversight](https://objective-see.org/products/oversight.html) to allow you to automatically turn your Litra device on or off when your webcam turns on and off. This allows you to be illuminated every time you join a video call!

To use the integration, just point Oversight at the `litra-oversight` CLI command. You can find the path of the binary on Unix machines by running `which litra-oversight` from a terminal after installing this package.

If you have multiple Litra devices, they will all be targeted when `litra-oversight` runs.