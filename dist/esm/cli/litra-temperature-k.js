#!/usr/bin/env node
import { program } from 'commander';
import { setTemperatureInKelvin } from '../driver';
import { getDeviceForCLI, parseIntOption } from './utils';
program
    .name('litra-temperature-k')
    .description('Sets the temperature of a Litra device to a value in Kelvin')
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command')
    .argument('<temperature>', 'the temperature in Kelvin, e.g. `2000`', parseIntOption);
program.parse();
const { serialNumber } = program.opts();
const [temperature] = program.processedArgs;
try {
    const device = getDeviceForCLI(serialNumber);
    setTemperatureInKelvin(device, temperature);
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
