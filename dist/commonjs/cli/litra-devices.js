#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const driver_1 = require("../driver");
commander_1.program
    .name('litra-devices')
    .description('Lists Litra devices connected to your computer. Defaults to human-readable plain text.')
    .option('--json', 'output the list of devices in structured JSON format');
commander_1.program.parse();
const { json } = commander_1.program.opts();
const devices = (0, driver_1.findDevices)();
if (json) {
    console.log(JSON.stringify(devices.map((device) => ({
        name: (0, driver_1.getNameForDevice)(device),
        serial_number: device.serialNumber,
    }))));
}
else {
    if (devices.length) {
        for (const device of devices) {
            console.log(`- ${(0, driver_1.getNameForDevice)(device)} (${device.serialNumber})`);
        }
    }
    else {
        console.log('No devices found');
    }
}
process.exit(0);
