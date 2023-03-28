#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const driver_1 = require("../driver");
const utils_1 = require("./utils");
commander_1.program
    .name('litra-brightness')
    .description('Sets the brightness of a Litra device to a value in Lumen')
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command')
    .argument('[brightness]', 'the brightness in Lumen, e.g. `80`', utils_1.parseIntOption);
commander_1.program.parse();
const { serialNumber } = commander_1.program.opts();
const [brightness] = commander_1.program.processedArgs;
try {
    const device = (0, utils_1.getDeviceForCLI)(serialNumber);
    if (brightness) {
        (0, driver_1.setBrightnessInLumen)(device, brightness);
    }
    else {
        console.log((0, driver_1.getBrightnessInLumen)(device));
    }
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
