import {
  DeviceType,
  getMaximumBrightnessInLumenForDevice,
  getMinimumBrightnessInLumenForDevice,
  getMaximumTemperatureInKelvinForDevice,
  getMinimumTemperatureInKelvinForDevice,
  setBrightnessInLumen,
  setBrightnessPercentage,
  setTemperatureInKelvin,
  setTemperaturePercentage,
  turnOff,
  turnOn,
} from '../src/driver';

describe('turnOn', () => {
  it('sends the instruction to turn the device on', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    turnOn(fakeDevice);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('turnOff', () => {
  it('sends the instruction to turn the device off', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    turnOff(fakeDevice);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('setTemperatureInKelvin', () => {
  it('sends the instruction to set the device temperature', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    setTemperatureInKelvin(fakeDevice, 6300);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 156, 24, 156, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the temperature is below the minimum for the device', () => {
    const fakeLitraGlow = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setTemperatureInKelvin(fakeLitraGlow, 2699)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );

    const fakeLitraBeam = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };

    expect(() => setTemperatureInKelvin(fakeLitraBeam, 2699)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );
  });

  it('throws an error if the temperature is above the maximum for the device', () => {
    const fakeLitraGlow = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setTemperatureInKelvin(fakeLitraGlow, 6501)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );

    const fakeLitraBeam = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };

    expect(() => setTemperatureInKelvin(fakeLitraBeam, 6501)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );
  });

  it('throws an error if the temperature is not an integer', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setTemperatureInKelvin(fakeDevice, 1337.9)).toThrowError(
      'Provided temperature must be an integer',
    );
  });
});

describe('setTemperaturePercentage', () => {
  it('sends the instruction to set the device temperature based on a percentage, ', () => {
    const fakeLitraGlow = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    setTemperaturePercentage(fakeLitraGlow, 100);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 156, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    const fakeLitraBeam = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };

    setTemperaturePercentage(fakeLitraBeam, 100);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 156, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the instruction to set the device temperature to the minimum temperature when set to 0%', () => {
    const fakeLitraGlow = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    setTemperaturePercentage(fakeLitraGlow, 0);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 156, 10, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    const fakeLitraBeam = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };

    setTemperaturePercentage(fakeLitraBeam, 0);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 156, 10, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the provided percentage is less than 0', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setTemperaturePercentage(fakeDevice, -1)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });

  it('throws an error if the provided percentage is more than 100', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setTemperaturePercentage(fakeDevice, 101)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });
});

describe('setBrightnessInLumen', () => {
  it('sends the instruction to set the device temperature', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    setBrightnessInLumen(fakeDevice, 20);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the brightness is below the minimum for the device', () => {
    const fakeLitraGlow = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setBrightnessInLumen(fakeLitraGlow, 19)).toThrowError(
      'Provided brightness must be between 20 and 250',
    );

    const fakeLitraBeam = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };

    expect(() => setBrightnessInLumen(fakeLitraBeam, 19)).toThrowError(
      'Provided brightness must be between 20 and 400',
    );
  });

  it('throws an error if the brightness is above the maximum for the device', () => {
    const fakeLitraGlow = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setBrightnessInLumen(fakeLitraGlow, 251)).toThrowError(
      'Provided brightness must be between 20 and 250',
    );

    const fakeLitraBeam = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };

    expect(() => setBrightnessInLumen(fakeLitraBeam, 401)).toThrowError(
      'Provided brightness must be between 20 and 400',
    );
  });

  it('throws an error if the brightness is not an integer', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setBrightnessInLumen(fakeDevice, 1337.9)).toThrowError(
      'Provided brightness must be an integer',
    );
  });
});

describe('setBrightnessPercentage', () => {
  it('sends the instruction to set the device brightness based on a percentage', () => {
    const fakeLitraGlow = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    setBrightnessPercentage(fakeLitraGlow, 100);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    const fakeLitraBeam = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };

    setBrightnessPercentage(fakeLitraBeam, 100);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the instruction to set the device brightness to the minimum brightness when set to 0%', () => {
    const fakeLitraGlow = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    setBrightnessPercentage(fakeLitraGlow, 0);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    const fakeLitraBeam = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };

    setBrightnessPercentage(fakeLitraBeam, 0);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the provided percentage is less than 0', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setBrightnessPercentage(fakeDevice, -1)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });

  it('throws an error if the provided percentage is more than 100', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };

    expect(() => setBrightnessPercentage(fakeDevice, 101)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });
});

describe('getMinimumBrightnessInLumenForDevice', () => {
  it('returns the correct minimum brightness for a Litra Glow', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };
    expect(getMinimumBrightnessInLumenForDevice(fakeDevice)).toEqual(20);
  });

  it('returns the correct minimum brightness for a Litra Beam', () => {
    const fakeDevice = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };
    expect(getMinimumBrightnessInLumenForDevice(fakeDevice)).toEqual(20);
  });
});

describe('getMaximumBrightnessInLumenForDevice', () => {
  it('returns the correct maximum brightness for a Litra Glow', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };
    expect(getMaximumBrightnessInLumenForDevice(fakeDevice)).toEqual(250);
  });

  it('returns the correct maximum brightness for a Litra Beam', () => {
    const fakeDevice = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };
    expect(getMaximumBrightnessInLumenForDevice(fakeDevice)).toEqual(400);
  });
});

describe('getMinimumTemperatureInKelvinForDevice', () => {
  it('returns the correct minimum temperature for a Litra Glow', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };
    expect(getMinimumTemperatureInKelvinForDevice(fakeDevice)).toEqual(2700);
  });

  it('returns the correct minimum temperature for a Litra Beam', () => {
    const fakeDevice = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };
    expect(getMinimumTemperatureInKelvinForDevice(fakeDevice)).toEqual(2700);
  });
});

describe('getMaximumTemperatureInKelvinForDevice', () => {
  it('returns the correct maximum temperature for a Litra Glow', () => {
    const fakeDevice = { type: DeviceType.LitraGlow, hid: { write: jest.fn() } };
    expect(getMaximumTemperatureInKelvinForDevice(fakeDevice)).toEqual(6500);
  });

  it('returns the correct maximum temperature for a Litra Beam', () => {
    const fakeDevice = { type: DeviceType.LitraBeam, hid: { write: jest.fn() } };
    expect(getMaximumTemperatureInKelvinForDevice(fakeDevice)).toEqual(6500);
  });
});
