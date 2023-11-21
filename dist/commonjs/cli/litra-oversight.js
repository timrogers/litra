#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const driver_1 = require("./../driver");
commander_1.program
    .name('litra-oversight')
    .description('Connects Oversight (<https://objective-see.org/products/oversight.html>) with Litra devices, allowing you to turn your Litra device on and off automatically with your webcam.')
    .option('-device <device>', 'the type of device that was turned on or off, either `camera` or `microphone`')
    .option('-event <event>', 'the event that happened to the device, either `on` or `off`')
    .option('-process <process>', 'the PID of the process that triggered the event (ignored)')
    .option('-activeCount <activeCount>', 'the number of devices still active (ignored)');
commander_1.program.parse();
// Commander isn't really designed to support these single dash arguments. When arguments are specified this way,
// the key is starts with a capital letter, which isn't the normal behaviour.
const { Device: deviceType, Event: event } = commander_1.program.opts();
try {
    const devices = (0, driver_1.findDevices)();
    if (devices.length) {
        const isCameraArg = deviceType === 'camera';
        const isEventOnArg = event === 'on';
        for (const device of devices) {
            if (isCameraArg) {
                if (isEventOnArg) {
                    (0, driver_1.turnOn)(device);
                }
                else {
                    (0, driver_1.turnOff)(device);
                }
            }
        }
        process.exit(0);
    }
    else {
        throw 'No devices found';
    }
}
catch (e) {
    console.log(e);
    process.exit(1);
}
