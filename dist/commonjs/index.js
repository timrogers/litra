"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnOff = exports.turnOn = exports.getDevice = void 0;
const node_hid_1 = __importDefault(require("node-hid"));
const VENDOR_ID = 0x046d;
const PRODUCT_ID = 0xc900;
const getDevice = () => new node_hid_1.default.HID(VENDOR_ID, PRODUCT_ID);
exports.getDevice = getDevice;
const turnOn = (device) => {
    device.write(padRight([0x11, 0xff, 0x04, 0x1c, 0x01], 20, 0x00));
};
exports.turnOn = turnOn;
const turnOff = (device) => {
    device.write(padRight([0x11, 0xff, 0x04, 0x1c, 0x00], 20, 0x00));
};
exports.turnOff = turnOff;
const padRight = (array, requiredLength, paddingElement) => [...array, ...Array(requiredLength - array.length).fill([paddingElement]).flat()];
