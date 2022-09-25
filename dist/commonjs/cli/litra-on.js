#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./../driver");
try {
    const device = (0, driver_1.findDevice)();
    (0, driver_1.turnOn)(device);
    process.exit(0);
}
catch (e) {
    console.log(e);
    process.exit(1);
}
