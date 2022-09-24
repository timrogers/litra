import HID from 'node-hid';
const VENDOR_ID = 0x046d;
const PRODUCT_ID = 0xc900;
export const getDevice = () => new HID.HID(VENDOR_ID, PRODUCT_ID);
export const turnOn = (device) => {
    device.write(padRight([0x11, 0xff, 0x04, 0x1c, 0x01], 20, 0x00));
};
export const turnOff = (device) => {
    device.write(padRight([0x11, 0xff, 0x04, 0x1c, 0x00], 20, 0x00));
};
const padRight = (array, requiredLength, paddingElement) => [...array, ...Array(requiredLength - array.length).fill([paddingElement]).flat()];
