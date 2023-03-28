import {
  DeviceType,
  getAllowedTemperaturesInKelvinForDevice,
  getMaximumBrightnessInLumenForDevice,
  getMinimumBrightnessInLumenForDevice,
  getMaximumTemperatureInKelvinForDevice,
  getMinimumTemperatureInKelvinForDevice,
  getNameForDevice,
  setBrightnessInLumen,
  getBrightnessInLumen,
  setBrightnessPercentage,
  setTemperatureInKelvin,
  getTemperatureInKelvin,
  turnOff,
  turnOn,
  toggle,
  Device,
} from '../src/driver';

const FAKE_SERIAL_NUMBER = 'fake_serial_number';

let fakeDevice: Device;
let fakeLitraGlow: Device;
let fakeLitraBeam: Device;

beforeEach(() => {
  fakeDevice = {
    type: DeviceType.LitraGlow,
    hid: { write: jest.fn(), readSync: jest.fn() },
    serialNumber: FAKE_SERIAL_NUMBER,
  };

  fakeLitraGlow = {
    type: DeviceType.LitraGlow,
    hid: { write: jest.fn(), readSync: jest.fn() },
    serialNumber: FAKE_SERIAL_NUMBER,
  };

  fakeLitraBeam = {
    type: DeviceType.LitraBeam,
    hid: { write: jest.fn(), readSync: jest.fn() },
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

describe('toggle', () => {
  it('sends the instruction to toggle the device on', () => {
    fakeDevice.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    toggle(fakeDevice);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the instruction to toggle the device off', () => {
    fakeDevice.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    toggle(fakeDevice);

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
      'Provided temperature must be a multiple of 100 between 2700 and 6500',
    );

    expect(() => setTemperatureInKelvin(fakeLitraBeam, 2699)).toThrowError(
      'Provided temperature must be a multiple of 100 between 2700 and 6500',
    );
  });

  it('throws an error if the temperature is above the maximum for the device', () => {
    expect(() => setTemperatureInKelvin(fakeLitraGlow, 6501)).toThrowError(
      'Provided temperature must be a multiple of 100 between 2700 and 6500',
    );

    expect(() => setTemperatureInKelvin(fakeLitraBeam, 6501)).toThrowError(
      'Provided temperature must be a multiple of 100 between 2700 and 6500',
    );
  });

  it('throws an error if the temperature is not an integer', () => {
    expect(() => setTemperatureInKelvin(fakeDevice, 1337.9)).toThrowError(
      'Provided temperature must be an integer',
    );
  });

  it('throws an error if the temperature is not a multiple of 100', () => {
    expect(() => setTemperatureInKelvin(fakeLitraGlow, 2750)).toThrowError(
      'Provided temperature must be a multiple of 100 between 2700 and 6500',
    );

    expect(() => setTemperatureInKelvin(fakeLitraBeam, 6499)).toThrowError(
      'Provided temperature must be a multiple of 100 between 2700 and 6500',
    );
  });
});

describe('getTemperatureInKelvin', () => {
  it('sends the instruction to get the device temperature', () => {
    fakeDevice.hid.readSync = jest
      .fn()
      .mockReturnValue([
        17, 255, 4, 129, 19, 136, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

    expect(getTemperatureInKelvin(fakeDevice)).toEqual(5000);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('setBrightnessInLumen', () => {
  it('sends the instruction to set the device brightness', () => {
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

describe('getBrightnessInLumen', () => {
  it('sends the instruction to get the device brightness', () => {
    fakeDevice.hid.readSync = jest
      .fn()
      .mockReturnValue([
        17, 255, 4, 49, 0, 216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

    expect(getBrightnessInLumen(fakeDevice)).toEqual(216);

    expect(fakeDevice.hid.write).toBeCalledWith([
      17, 255, 4, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
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

describe('getAllowedTemperaturesInKelvinForDevice', () => {
  it('returns the allowed temperatures for a Litra Glow', () => {
    expect(getAllowedTemperaturesInKelvinForDevice(fakeLitraGlow)).toEqual([
      2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000,
      4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400,
      5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500,
    ]);
  });

  it('returns the allowed temperatures for a Litra Beam', () => {
    expect(getAllowedTemperaturesInKelvinForDevice(fakeLitraBeam)).toEqual([
      2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000,
      4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400,
      5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500,
    ]);
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
