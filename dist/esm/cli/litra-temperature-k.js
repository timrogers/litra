#!/usr/bin/env node
import { program } from 'commander';
import { getTemperatureInKelvin, setTemperatureInKelvin } from '../driver';
import { getDeviceForCLI, parseIntOption } from './utils';
program
    .name('litra-temperature-k')
    .description("Manages the temperature of a Litra device. If a temperature argument is provided, it sets the device's temperature to the supplied value in Kelvin. If no temperature argument is provided, it returns the current temperature in Kelvin.")
    .option('-s, --serial-number <serialNumber>', 'serial number of the Litra device. If this is not specified and multiple devices are connected, this will default to the first identified device, which is not guaranteed to be the same every time you run this command')
    .argument('[temperature]', 'the temperature in Kelvin, e.g. `2000`', parseIntOption);
program.parse();
const { serialNumber } = program.opts();
const [temperature] = program.processedArgs;
try {
    const device = getDeviceForCLI(serialNumber);
    if (temperature) {
        setTemperatureInKelvin(device, temperature);
    }
    else {
        console.log(getTemperatureInKelvin(device));
    }
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
