#!/usr/bin/env node

import { findDevice, setTemperaturePercentage } from '../driver';

try {
  const device = findDevice();

  if (device) {
    const value = process.argv[2];
    setTemperaturePercentage(device, parseInt(value));
  } else {
    throw 'Device not found';
  }

  process.exit(0);
} catch (e) {
  console.log(e);
  process.exit(1);
}
