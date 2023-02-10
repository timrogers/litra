#!/usr/bin/env node
import { program } from 'commander';
import { setTemperaturePercentage } from '../driver';
import { getDeviceForCLI, parseIntOption } from './utils';
program
    .name('litra-temperature')
    .description("Sets the temperature of a Litra device to a percentage of the device's maximum temperature")
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command')
    .argument('<temperature>', "the percentage of the device's maximum temperature, e.g. `80`", parseIntOption);
program.parse();
const { serialNumber } = program.opts();
const [temperature] = program.processedArgs;
try {
    const device = getDeviceForCLI(serialNumber);
    setTemperaturePercentage(device, temperature);
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
