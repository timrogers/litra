#!/usr/bin/env node

import { findDevice, turnOff } from './../driver';

try {
  const device = findDevice();

  if (device) {
    turnOff(device);
  } else {
    throw 'Device not found';
  }

  process.exit(0);
} catch (e) {
  console.log(e);
  process.exit(1);
}
