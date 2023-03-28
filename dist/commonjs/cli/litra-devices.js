#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const driver_1 = require("../driver");
commander_1.program
    .name('litra-devices')
    .description('Lists Litra devices connected to your computer. Defaults to human-readable plain text. The structure and content of the plain text output may change in future versions. If you need a machine-readable output with consistency guarantees, use the `--json` option.')
    .option('--json', 'output the list of devices in structured JSON format. New attributes may be added to the JSON output in future versions. Existing attributes will only be removed or changed in a backwards-incompatible way in major versions.');
commander_1.program.parse();
const { json } = commander_1.program.opts();
const devices = (0, driver_1.findDevices)();
if (json) {
    console.log(JSON.stringify(devices.map((device) => ({
        name: (0, driver_1.getNameForDevice)(device),
        serial_number: device.serialNumber,
        is_on: (0, driver_1.isOn)(device),
        brightness_in_lumen: (0, driver_1.getBrightnessInLumen)(device),
        temperature_in_kelvin: (0, driver_1.getTemperatureInKelvin)(device),
    }))));
}
else {
    if (devices.length) {
        for (const device of devices) {
            console.log(`- ${(0, driver_1.getNameForDevice)(device)} (${device.serialNumber}): ${(0, driver_1.isOn)(device) ? 'On 💡' : 'Off 🌑'}`);
            console.log(`  - Brightness: ${(0, driver_1.getBrightnessInLumen)(device)} lm`);
            console.log(`  - Temperature: ${(0, driver_1.getTemperatureInKelvin)(device)} K`);
        }
    }
    else {
        console.log('No devices found');
    }
}
process.exit(0);
