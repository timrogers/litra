#!/usr/bin/env node

import { program } from 'commander';
import { setBrightnessInLumen } from '../driver';
import { getDeviceForCLI, parseIntOption } from './utils';

program
  .name('litra-brightness')
  .description('Sets the brightness of a Litra device to a value in Lumen')
  .option(
    '-s, --serial-number <serialNumber>',
    'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command',
  )
  .argument('<brightness>', 'the brightness in Lumen, e.g. `80`', parseIntOption);

program.parse();
const { serialNumber } = program.opts();
const [brightness] = program.processedArgs;

try {
  const device = getDeviceForCLI(serialNumber);
  setBrightnessInLumen(device, brightness);
  process.exit(0);
} catch (e) {
  console.log(e);
  process.exit(1);
}
