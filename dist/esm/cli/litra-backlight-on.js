#!/usr/bin/env node
import { program } from 'commander';
import { backlightOn } from './../driver';
import { getDeviceForCLI } from './utils';
program
    .name('litra-backlight-on')
    .description('Activate the backlight on a Litra Beam LX device')
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra Beam LX device to control');
program.parse();
const { serialNumber } = program.opts();
try {
    const device = getDeviceForCLI(serialNumber);
    backlightOn(device);
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
