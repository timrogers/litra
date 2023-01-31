#!/usr/bin/env node

import { findDevice, turnOff, turnOn } from './../driver';

try {
  const device = findDevice();

  if (!device) {
    throw 'Device not found';
  }

  const DEVICE_ARG_VAL = 'camera';
  const EVENT_ARG_VAL = 'on';

  const deviceArgVal = process.argv[3];
  const eventArgVal = process.argv[5];

  const isCameraArg = deviceArgVal == DEVICE_ARG_VAL;
  const isEventOnArg = eventArgVal == EVENT_ARG_VAL;

  if (isCameraArg) {
    if (isEventOnArg) {
      turnOn(device);
    } else {
      turnOff(device);
    }
  }

  process.exit(0);
} catch (e) {
  console.log(e);
  process.exit(1);
}
