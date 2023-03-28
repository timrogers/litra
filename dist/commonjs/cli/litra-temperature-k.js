#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const driver_1 = require("../driver");
const utils_1 = require("./utils");
commander_1.program
    .name('litra-temperature-k')
    .description('Sets the temperature of a Litra device to a value in Kelvin')
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command')
    .argument('[temperature]', 'the temperature in Kelvin, e.g. `2000`', utils_1.parseIntOption);
commander_1.program.parse();
const { serialNumber } = commander_1.program.opts();
const [temperature] = commander_1.program.processedArgs;
try {
    const device = (0, utils_1.getDeviceForCLI)(serialNumber);
    if (temperature) {
        (0, driver_1.setTemperatureInKelvin)(device, temperature);
    }
    else {
        console.log((0, driver_1.getTemperatureInKelvin)(device));
    }
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
