#!/usr/bin/env node

import { program } from 'commander';
import { turnOff } from './../driver';
import { getDeviceForCLI } from './utils';

program
  .name('litra-off')
  .description('Turn off a Litra device')
  .option('-s, --serial-number <serialNumber>', 'serial number of the Litra device');

program.parse();
const { serialNumber } = program.opts();

try {
  const device = getDeviceForCLI(serialNumber);
  turnOff(device);
  process.exit(0);
} catch (e) {
  console.log(e);
  process.exit(1);
}
