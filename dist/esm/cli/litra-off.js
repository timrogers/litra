#!/usr/bin/env node
import { findDevice, turnOff } from './../driver';
try {
    const device = findDevice();
    turnOff(device);
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
