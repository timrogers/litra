#!/usr/bin/env node

import { findDevice, turnOn } from './../driver';

try {
  const device = findDevice();
  turnOn(device);
  process.exit(0);
} catch (e) {
  console.log(e);
  process.exit(1);
}
