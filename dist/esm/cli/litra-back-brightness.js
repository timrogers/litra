#!/usr/bin/env node
import { program } from 'commander';
import { setBacklightBrightnessPercentage, getBacklightBrightnessPercentage } from '../driver';
import { getDeviceForCLI, parseIntOption } from './utils';
program
    .name('litra-back-brightness')
    .description('Gets or sets the brightness of the backlight on a Litra Beam LX device as a percentage (0-100)')
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command')
    .argument('[brightness]', 'the percentage of the backlight brightness to set, e.g. `80`. If not provided, the current brightness will be returned', parseIntOption);
program.parse();
const { serialNumber } = program.opts();
const [brightness] = program.processedArgs;
try {
    const device = getDeviceForCLI(serialNumber);
    if (brightness !== undefined) {
        setBacklightBrightnessPercentage(device, brightness);
    }
    else {
        const currentBrightness = getBacklightBrightnessPercentage(device);
        console.log(currentBrightness);
    }
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
