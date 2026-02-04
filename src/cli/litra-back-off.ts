#!/usr/bin/env node

import { program } from 'commander';
import { setBacklightOff } from './../driver';
import { getDeviceForCLI } from './utils';

program
  .name('litra-back-off')
  .description('Turn off the backlight on a Litra Beam LX device')
  .option(
    '-s, --serial-number <serialNumber>',
    'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command',
  );

program.parse();
const { serialNumber } = program.opts();

try {
  const device = getDeviceForCLI(serialNumber);
  setBacklightOff(device);
  process.exit(0);
} catch (e) {
  console.log(e);
  process.exit(1);
}
