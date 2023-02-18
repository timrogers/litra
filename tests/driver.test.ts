import {
  DeviceType,
  getMaximumBrightnessInLumenForDevice,
  getMinimumBrightnessInLumenForDevice,
  getMaximumTemperatureInKelvinForDevice,
  getMinimumTemperatureInKelvinForDevice,
  getNameForDevice,
  setBrightnessInLumen,
  setBrightnessPercentage,
  setTemperatureInKelvin,
  turnOff,
  turnOn,
  Device,
} from '../src/driver';

const FAKE_SERIAL_NUMBER = 'fake_serial_number';

let fakeDevice: Device;
let fakeLitraGlow: Device;
let fakeLitraBeam: Device;

beforeEach(() => {
  fakeDevice = {
    type: DeviceType.LitraGlow,
    hid: { write: jest.fn() },
    serialNumber: FAKE_SERIAL_NUMBER,
  };

  fakeLitraGlow = {
    type: DeviceType.LitraGlow,
    hid: { write: jest.fn() },
    serialNumber: FAKE_SERIAL_NUMBER,
  };

  fakeLitraBeam = {
    type: DeviceType.LitraBeam,
    hid: { write: jest.fn() },
    serialNumber: FAKE_SERIAL_NUMBER,
  };
});

describe('turnOn', () => {
  it('sends the instruction to turn the device on', () => {
    turnOn(fakeDevice);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('turnOff', () => {
  it('sends the instruction to turn the device off', () => {
    turnOff(fakeDevice);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('setTemperatureInKelvin', () => {
  it('sends the instruction to set the device temperature', () => {
    setTemperatureInKelvin(fakeDevice, 6300);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 156, 24, 156, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the temperature is below the minimum for the device', () => {
    expect(() => setTemperatureInKelvin(fakeLitraGlow, 2699)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );

    expect(() => setTemperatureInKelvin(fakeLitraBeam, 2699)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );
  });

  it('throws an error if the temperature is above the maximum for the device', () => {
    expect(() => setTemperatureInKelvin(fakeLitraGlow, 6501)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );

    expect(() => setTemperatureInKelvin(fakeLitraBeam, 6501)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );
  });

  it('throws an error if the temperature is not an integer', () => {
    expect(() => setTemperatureInKelvin(fakeDevice, 1337.9)).toThrowError(
      'Provided temperature must be an integer',
    );
  });
});

describe('setBrightnessInLumen', () => {
  it('sends the instruction to set the device temperature', () => {
    setBrightnessInLumen(fakeDevice, 20);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the brightness is below the minimum for the device', () => {
    expect(() => setBrightnessInLumen(fakeLitraGlow, 19)).toThrowError(
      'Provided brightness must be between 20 and 250',
    );

    expect(() => setBrightnessInLumen(fakeLitraBeam, 19)).toThrowError(
      'Provided brightness must be between 30 and 400',
    );
  });

  it('throws an error if the brightness is above the maximum for the device', () => {
    expect(() => setBrightnessInLumen(fakeLitraGlow, 251)).toThrowError(
      'Provided brightness must be between 20 and 250',
    );

    expect(() => setBrightnessInLumen(fakeLitraBeam, 401)).toThrowError(
      'Provided brightness must be between 30 and 400',
    );
  });

  it('throws an error if the brightness is not an integer', () => {
    expect(() => setBrightnessInLumen(fakeDevice, 1337.9)).toThrowError(
      'Provided brightness must be an integer',
    );
  });
});

describe('setBrightnessPercentage', () => {
  it('sends the instruction to set the device brightness based on a percentage', () => {
    setBrightnessPercentage(fakeLitraGlow, 100);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    setBrightnessPercentage(fakeLitraBeam, 100);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the instruction to set the device brightness to the minimum brightness when set to 0%', () => {
    setBrightnessPercentage(fakeLitraGlow, 0);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    setBrightnessPercentage(fakeLitraBeam, 0);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the provided percentage is less than 0', () => {
    expect(() => setBrightnessPercentage(fakeDevice, -1)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });

  it('throws an error if the provided percentage is more than 100', () => {
    expect(() => setBrightnessPercentage(fakeDevice, 101)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });
});

describe('getMinimumBrightnessInLumenForDevice', () => {
  it('returns the correct minimum brightness for a Litra Glow', () => {
    expect(getMinimumBrightnessInLumenForDevice(fakeLitraGlow)).toEqual(20);
  });

  it('returns the correct minimum brightness for a Litra Beam', () => {
    expect(getMinimumBrightnessInLumenForDevice(fakeLitraBeam)).toEqual(30);
  });
});

describe('getMaximumBrightnessInLumenForDevice', () => {
  it('returns the correct maximum brightness for a Litra Glow', () => {
    expect(getMaximumBrightnessInLumenForDevice(fakeLitraGlow)).toEqual(250);
  });

  it('returns the correct maximum brightness for a Litra Beam', () => {
    expect(getMaximumBrightnessInLumenForDevice(fakeLitraBeam)).toEqual(400);
  });
});

describe('getMinimumTemperatureInKelvinForDevice', () => {
  it('returns the correct minimum temperature for a Litra Glow', () => {
    expect(getMinimumTemperatureInKelvinForDevice(fakeLitraGlow)).toEqual(2700);
  });

  it('returns the correct minimum temperature for a Litra Beam', () => {
    expect(getMinimumTemperatureInKelvinForDevice(fakeLitraBeam)).toEqual(2700);
  });
});

describe('getMaximumTemperatureInKelvinForDevice', () => {
  it('returns the correct maximum temperature for a Litra Glow', () => {
    expect(getMaximumTemperatureInKelvinForDevice(fakeLitraGlow)).toEqual(6500);
  });

  it('returns the correct maximum temperature for a Litra Beam', () => {
    expect(getMaximumTemperatureInKelvinForDevice(fakeLitraBeam)).toEqual(6500);
  });
});

describe('getNameForDevice', () => {
  it('returns the correct name for a Litra Glow', () => {
    expect(getNameForDevice(fakeLitraGlow)).toEqual('Logitech Litra Glow');
  });

  it('returns the correct name for a Litra Beam', () => {
    expect(getNameForDevice(fakeLitraBeam)).toEqual('Logitech Litra Beam');
  });
});
