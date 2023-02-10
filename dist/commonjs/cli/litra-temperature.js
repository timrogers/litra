#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const driver_1 = require("../driver");
const utils_1 = require("./utils");
commander_1.program
    .name('litra-temperature')
    .description("Sets the temperature of a Litra device to a percentage of the device's maximum temperature")
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command')
    .argument('<temperature>', "the percentage of the device's maximum temperature, e.g. `80`", utils_1.parseIntOption);
commander_1.program.parse();
const { serialNumber } = commander_1.program.opts();
const [temperature] = commander_1.program.processedArgs;
try {
    const device = (0, utils_1.getDeviceForCLI)(serialNumber);
    (0, driver_1.setTemperaturePercentage)(device, temperature);
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
