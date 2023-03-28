#!/usr/bin/env node
import { program } from 'commander';
import { findDevices, getBrightnessInLumen, getNameForDevice, getTemperatureInKelvin, isOn } from '../driver';
program
    .name('litra-devices')
    .description('Lists Litra devices connected to your computer. Defaults to human-readable plain text.')
    .option('--json', 'output the list of devices in structured JSON format');
program.parse();
const { json } = program.opts();
const devices = findDevices();
if (json) {
    console.log(JSON.stringify(devices.map((device) => ({
        name: getNameForDevice(device),
        serial_number: device.serialNumber,
        is_on: isOn(device),
        brightness_in_lumen: getBrightnessInLumen(device),
        temperature_in_kelvin: getTemperatureInKelvin(device),
    }))));
}
else {
    if (devices.length) {
        for (const device of devices) {
            console.log(`- ${getNameForDevice(device)} (${device.serialNumber}): ${isOn(device) ? 'On 💡' : 'Off 🌑'}`);
            console.log(`  - Brightness: ${getBrightnessInLumen(device)} lm`);
            console.log(`  - Temperature: ${getTemperatureInKelvin(device)} K`);
        }
    }
    else {
        console.log('No devices found');
    }
}
process.exit(0);
