# Logitech Litra

This JavaScript driver allows you to control [Logitech Litra Glow](https://www.logitech.com/en-gb/products/lighting/litra-glow.946-000002.html) and [Logitech Litra Beam](https://www.logitech.com/en-gb/products/lighting/litra-beam.946-000007.html) lights using a CLI and from your JavaScript code.

With this driver, you can:

* Turn your light on and off
* Set the brightness of your light
* Set the temperature of your light

## Compatibility

This library is only tested on macOS Monterey (12.5). It's powered by [`node-hid`](https://github.com/node-hid/node-hid), which is compatible with other macOS versions, Windows and Linux, so it would be expected to work there too, but your milage may vary 🙏

## Using as a command line tool

Make sure you have Node.js available on your machine, and then install the package with `npm install -g litra-glow`.

With the package installed, use the `litra-on` and `litra-off` commands to turn your light on and off.

## Using as a JavaScript library

### Installation

Simply add the `litra-glow` Node.js package to your `package.json` and install it:

```sh
npm install --save litra-glow
```

### Usage

#### Checking if a Litra device is plugged in

The `findDevice` function checks your computer to find whether a Logitech Litra device is plugged in. 

If it is, it returns an object representing the device, which you can pass into other function. If it isn't, it returns `null`.

```js
import { findDevice } from 'litra-glow';

const device = findDevice();

if (device) {
  console.log(`Found a ${device.type} device connected`);

  // Do something
} else {
  // Blow up
}
```

If you're a *huge* fan of Litra devices and you have multiple plugged in at the same time, it'll return whatever one it happens to find first.

#### Turning your Litra device on or off

Find your device with `findDevice`, and then use the simple `turnOn` and `turnOff` functions. They just take one parameter: the device.

```js
import { findDevice, turnOff, turnOn } from 'litra-glow';

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
import { findDevice, getMaximumBrightnessInLumenForDevice, getMinimumBrightnessInLumenForDevice, setBrightnessInLumen } from 'litra-glow';

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
import { findDevice, setBrightnessPercentage } from 'litra-glow';

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
import { findDevice, getMaximumTemperatureInKelvinForDevice, getMinimumTemperatureInKelvinForDevice, setTemperatureInKelvin } from 'litra-glow';

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
import { findDevice, setTemperaturePercentage } from 'litra-glow';

const device = findDevice();

if (device) {
  setTemperaturePercentage(device, 75);
}
```