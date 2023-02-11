#!/usr/bin/env node

import { program } from 'commander';
import { findDevices, getNameForDevice } from '../driver';

program
  .name('litra-devices')
  .description(
    'Lists Litra devices connected to your computer. Defaults to human-readable plain text.',
  )
  .option('--json', 'output the list of devices in structured JSON format');

program.parse();
const { json } = program.opts();

const devices = findDevices();

if (json) {
  console.log(
    JSON.stringify(
      devices.map((device) => ({
        name: getNameForDevice(device),
        serial_number: device.serialNumber,
      })),
    ),
  );
} else {
  if (devices.length) {
    for (const device of devices) {
      console.log(`- ${getNameForDevice(device)} (${device.serialNumber})`);
    }
  } else {
    console.log('No devices found');
  }
}

process.exit(0);
