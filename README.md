# Logitech Litra Glow

This JavaScript library allows you to control your [Logitech Litra Glow](https://www.logitech.com/en-gb/products/lighting/litra-glow.946-000002.html) light programatically.

With this driver, you can:

* Turn your light on and off
* Set the brightness of your light
* Set the temperature of your light

## Compatibility

This library is only tested on macOS Monterey (12.5). It's powered by [`node-hid`](https://github.com/node-hid/node-hid), which is compatible with other macOS versions, Windows and Linux, so it would be expected to work there too, but your milage may vary 🙏

## Installation

Simply add the `litra-glow` Node.js package to your `package.json`:

```sh
npm install --save litra-glow
```

## Usage

### Checking if a Litra Glow is plugged in

The `findDevice` function checks your computer to find whether a Logitech Litra Glow is plugged in. 

If it is, an object representing the device is returned, which you can pass into other function. If it isn't, an error is thrown.

```js
import { findDevice } from 'litra-glow';

const device = findDevice();
```

If you're a *huge* fan of the Litra Glow and you have multipled plugged in at the same time, it'll return whatever one it happens to find first.

### Turning your Litra Glow on or off

Find your device with `findDevice`, and then use the simple `turnOn` and `turnOff` functions. They just take one parameter: the device.

```js
import { findDevice, turnOff, turnOn } from 'litra-glow';

const device = findDevice();

// Turn your light on, then turn it off again after 5 seconds
turnOn(device);
setTimeout(() => turnOff(device), 5000));
```

### Setting the brightness of your Litra Glow

You can set the brightness of your Litra Glow, measured in Lumen, using the `setBrightnessInLumen` function. The Litra Glow supports brightness between 20 and 250 Lumen:

```js
import { findDevice, setBrightnessInLumen } from 'litra-glow';

const device = findDevice();

setBrightnessInLumen(device, 150);
```

You can also set brightness level to a percentage with `setBrightnessPercentage` if you don't want to think in Lumen:

```js
import { findDevice, setBrightnessPercentage } from 'litra-glow';

const device = findDevice();

setBrightnessPercentage(device, 75);
```

### Setting the temperature of your Litra Glow

You can set the temperature of your Litra Glow, measured in Kelvin, using the `setTemperatureInKelvin` function. The Litra Glow supports temperature between 2700 and 6500 Kelvin:

```js
import { findDevice, setTemperatureInKelvin } from 'litra-glow';

const device = findDevice();

setTemperatureInKelvin(device, 4500);
```

You can also set brightness level to a percentage with `setTemperaturePercentage` if you don't want to think in Lumen:

```js
import { findDevice, setTemperaturePercentage } from 'litra-glow';

const device = findDevice();

setTemperaturePercentage(device, 75);
```