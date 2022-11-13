#!/usr/bin/env node
import { findDevice, turnOn } from './../driver';
try {
    const device = findDevice();
    if (device) {
        turnOn(device);
    }
    else {
        throw 'Device not found';
    }
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
