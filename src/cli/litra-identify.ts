#!/usr/bin/env node

import { program } from 'commander';
import * as readline from 'readline';
import { promisify } from 'util';
import { findDevices, getNameForDevice, turnOff, turnOn } from '../driver';
import { sleep } from './utils';

program
  .name('litra-identify')
  .description('Identify the serial number(s) of your Litra device(s)');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = promisify(rl.question).bind(rl);

(async () => {
  try {
    const devices = findDevices();

    const noun = devices.length === 1 ? 'device' : 'devices';
    console.log(`Found ${devices.length} connected Litra ${noun}`);

    for (const device of devices) {
      const deviceName = getNameForDevice(device);
      console.log(
        `Flashing light on ${deviceName} device with serial number ${device.serialNumber}`,
      );

      turnOn(device);
      await sleep(500);
      turnOff(device);
      await sleep(500);
      turnOn(device);
      await sleep(500);
      turnOff(device);

      await question('Press Enter to continue >');
    }

    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
