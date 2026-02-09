#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const driver_1 = require("./../driver");
const utils_1 = require("./utils");
commander_1.program
    .name('litra-backlight-on')
    .description('Activate the backlight on a Litra Beam LX device')
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra Beam LX device to control');
commander_1.program.parse();
const { serialNumber } = commander_1.program.opts();
try {
    const device = (0, utils_1.getDeviceForCLI)(serialNumber);
    (0, driver_1.backlightOn)(device);
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
