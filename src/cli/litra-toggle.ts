#!/usr/bin/env node

import { findDevice, turnOff, turnOn } from "./../driver";

try {
  const device = findDevice();

  if (!device) {
    throw "Device not found";
  }

  const deviceArgKey = "-device";
  const deviceArgVal = "camera";

  const eventArgKey = "-event";
  const eventArgVal = "on";

  const deviceArg = process.argv[2] == deviceArgKey &&
    process.argv[3] == deviceArgVal;
  const eventArg = process.argv[4] == eventArgKey &&
    process.argv[5] == eventArgVal;

  if (deviceArg && eventArg) {
    turnOn(device);
  } else {
    turnOff(device);
  }

  process.exit(0);
} catch (e) {
  console.log(e);
  process.exit(1);
}
