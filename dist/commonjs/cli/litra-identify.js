#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const readline = __importStar(require("readline"));
const util_1 = require("util");
const driver_1 = require("../driver");
const utils_1 = require("./utils");
commander_1.program
    .name('litra-identify')
    .description('Identify the serial number(s) of your Litra device(s)');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const question = (0, util_1.promisify)(rl.question).bind(rl);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const devices = (0, driver_1.findDevices)();
        const noun = devices.length === 1 ? 'device' : 'devices';
        console.log(`Found ${devices.length} connected Litra ${noun}`);
        for (const device of devices) {
            const deviceName = (0, driver_1.getNameForDevice)(device);
            console.log(`Flashing light on ${deviceName} device with serial number ${device.serialNumber}`);
            (0, driver_1.turnOn)(device);
            yield (0, utils_1.sleep)(500);
            (0, driver_1.turnOff)(device);
            yield (0, utils_1.sleep)(500);
            (0, driver_1.turnOn)(device);
            yield (0, utils_1.sleep)(500);
            (0, driver_1.turnOff)(device);
            yield question('Press Enter to continue >');
        }
        process.exit(0);
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
}))();
