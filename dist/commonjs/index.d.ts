import HID from 'node-hid';
export declare const getDevice: () => HID.HID;
export declare const turnOn: (device: HID.HID) => void;
export declare const turnOff: (device: HID.HID) => void;
