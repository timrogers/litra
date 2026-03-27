#!/usr/bin/env node
import { program } from 'commander';
import { backlightOff } from './../driver';
import { getDeviceForCLI } from './utils';
program
    .name('litra-backlight-off')
    .description('Deactivate the backlight on a Litra Beam LX device')
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra Beam LX device to control');
program.parse();
const { serialNumber } = program.opts();
try {
    const device = getDeviceForCLI(serialNumber);
    backlightOff(device);
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
