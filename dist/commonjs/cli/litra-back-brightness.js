#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const driver_1 = require("../driver");
const utils_1 = require("./utils");
commander_1.program
    .name('litra-back-brightness')
    .description('Gets or sets the brightness of the backlight on a Litra Beam LX device as a percentage (0-100)')
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command')
    .argument('[brightness]', 'the percentage of the backlight brightness to set, e.g. `80`. If not provided, the current brightness will be returned', utils_1.parseIntOption);
commander_1.program.parse();
const { serialNumber } = commander_1.program.opts();
const [brightness] = commander_1.program.processedArgs;
try {
    const device = (0, utils_1.getDeviceForCLI)(serialNumber);
    if (brightness !== undefined) {
        (0, driver_1.setBacklightBrightnessPercentage)(device, brightness);
    }
    else {
        const currentBrightness = (0, driver_1.getBacklightBrightnessPercentage)(device);
        console.log(currentBrightness);
    }
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
