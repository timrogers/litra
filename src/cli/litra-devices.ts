#!/usr/bin/env node

import { program } from 'commander';
import {
  findDevices,
  getBrightnessInLumen,
  getNameForDevice,
  getTemperatureInKelvin,
  isOn,
} from '../driver';

program
  .name('litra-devices')
  .description(
    'Lists Litra devices connected to your computer. Defaults to human-readable plain text. The structure and content of the plain text output may change in future versions. If you need a machine-readable output with consistency guarantees, use the `--json` option.',
  )
  .option(
    '--json',
    'output the list of devices in structured JSON format. New attributes may be added to the JSON output in future versions. Existing attributes will only be removed or changed in a backwards-incompatible way in major versions.',
  )
  .option(
    '--version',
    'output the current version of the `litra` package, rather than a list of devices.',
  );
program.parse();
const { json, version } = program.opts();

if (version) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  console.log(require('../../../package.json').version);
  process.exit(0);
}

const devices = findDevices();

if (json) {
  console.log(
    JSON.stringify(
      devices.map((device) => ({
        name: getNameForDevice(device),
        serial_number: device.serialNumber,
        is_on: isOn(device),
        brightness_in_lumen: getBrightnessInLumen(device),
        temperature_in_kelvin: getTemperatureInKelvin(device),
      })),
    ),
  );
} else {
  if (devices.length) {
    for (const device of devices) {
      console.log(
        `- ${getNameForDevice(device)} (${device.serialNumber}): ${
          isOn(device) ? 'On 💡' : 'Off 🌑'
        }`,
      );
      console.log(`  - Brightness: ${getBrightnessInLumen(device)} lm`);
      console.log(`  - Temperature: ${getTemperatureInKelvin(device)} K`);
    }
  } else {
    console.log('No devices found');
  }
}

process.exit(0);
