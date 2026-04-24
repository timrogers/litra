#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { program } from 'commander';
import * as readline from 'readline';
import { promisify } from 'util';
import { findDevices, getNameForDevice, turnOff, turnOn } from '../driver';
import { sleep } from './utils';
program
    .name('litra-identify')
    .description('Identify the serial number(s) of your Litra device(s)');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const question = promisify(rl.question).bind(rl);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const devices = findDevices();
        const noun = devices.length === 1 ? 'device' : 'devices';
        console.log(`Found ${devices.length} connected Litra ${noun}`);
        for (const device of devices) {
            const deviceName = getNameForDevice(device);
            console.log(`Flashing light on ${deviceName} device with serial number ${device.serialNumber}`);
            turnOn(device);
            yield sleep(500);
            turnOff(device);
            yield sleep(500);
            turnOn(device);
            yield sleep(500);
            turnOff(device);
            yield question('Press Enter to continue >');
        }
        process.exit(0);
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
}))();
