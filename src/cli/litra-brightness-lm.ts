#!/usr/bin/env node

import { findDevice, setBrightnessInLumen } from '../driver';

try {
  const device = findDevice();

  if (device) {
    const value = process.argv[2];
    setBrightnessInLumen(device, parseInt(value));
  } else {
    throw 'Device not found';
  }

  process.exit(0);
} catch (e) {
  console.log(e);
  process.exit(1);
}
