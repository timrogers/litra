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
  isOn,
  Device,
} from '../src/driver';

const FAKE_SERIAL_NUMBER = 'fake_serial_number';

let fakeDevice: Device;
let fakeLitraGlow: Device;
let fakeLitraBeam: Device;
let fakeLitraBeamLx: Device;

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

  fakeLitraBeamLx = {
    type: DeviceType.LitraBeamLX,
    hid: { write: jest.fn(), readSync: jest.fn() },
    serialNumber: FAKE_SERIAL_NUMBER,
  };
});

describe('turnOn', () => {
  it('sends the correct instruction to turn the device on for a Litra Glow', () => {
    turnOn(fakeLitraGlow);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the correct instruction to turn the device on for a Litra Beam', () => {
    turnOn(fakeLitraBeam);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the correct instruction to turn the device on for a Litra Beam LX', () => {
    turnOn(fakeLitraBeamLx);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('turnOff', () => {
  it('sends the correct instruction to turn the device off for a Litra Glow', () => {
    turnOff(fakeLitraGlow);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the correct instruction to turn the device off for a Litra Beam', () => {
    turnOff(fakeLitraBeam);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the correct instruction to turn the device off for a Litra Beam LX', () => {
    turnOff(fakeLitraBeamLx);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('toggle', () => {
  it('sends the right instruction to turn a Litra Glow on when it is off', () => {
    fakeLitraGlow.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    toggle(fakeLitraGlow);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to turn a Litra Beam on when it is off', () => {
    fakeLitraBeam.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    toggle(fakeLitraBeam);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to turn a Litra Beam LX on when it is off', () => {
    fakeLitraBeamLx.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    toggle(fakeLitraBeamLx);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to turn the Litra Glow off when it is on', () => {
    fakeLitraGlow.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    toggle(fakeLitraGlow);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to turn the Litra Beam off when it is on', () => {
    fakeLitraBeam.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    toggle(fakeLitraBeam);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to turn the Litra Beam LX off when it is on', () => {
    fakeLitraBeamLx.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    toggle(fakeLitraBeamLx);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('isOn', () => {
  it('sends the right instruction to get the device power state for a Litra Glow', () => {
    fakeLitraGlow.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    isOn(fakeLitraGlow);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to get the device power state for a Litra Beam', () => {
    fakeLitraBeam.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    isOn(fakeLitraBeam);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to get the device power state for a Litra Beam LX', () => {
    fakeLitraBeamLx.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    isOn(fakeLitraBeamLx);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('returns true when the device is on', () => {
    fakeDevice.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    expect(isOn(fakeDevice)).toBe(true);
  });

  it('returns false when the device is off', () => {
    fakeDevice.hid.readSync = jest
      .fn()
      .mockReturnValue([17, 255, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    expect(isOn(fakeDevice)).toBe(false);
  });
});

describe('setTemperatureInKelvin', () => {
  it('sends the right instruction to set the temperature for a Litra Glow', () => {
    setTemperatureInKelvin(fakeLitraGlow, 6300);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 156, 24, 156, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to set the temperature for a Litra Beam', () => {
    setTemperatureInKelvin(fakeLitraBeam, 6300);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 156, 24, 156, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to set the temperature for a Litra Beam LX', () => {
    setTemperatureInKelvin(fakeLitraBeamLx, 6300);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 156, 24, 156, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
  it('sends the right instruction to get the temperature for a Litra Glow', () => {
    fakeLitraGlow.hid.readSync = jest
      .fn()
      .mockReturnValue([
        17, 255, 4, 129, 19, 136, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

    expect(getTemperatureInKelvin(fakeLitraGlow)).toEqual(5000);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to get the temperature for a Litra Beam', () => {
    fakeLitraBeam.hid.readSync = jest
      .fn()
      .mockReturnValue([
        17, 255, 4, 129, 19, 136, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

    expect(getTemperatureInKelvin(fakeLitraBeam)).toEqual(5000);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to get the temperature for a Litra Beam LX', () => {
    fakeLitraBeamLx.hid.readSync = jest
      .fn()
      .mockReturnValue([
        17, 255, 4, 129, 19, 136, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

    expect(getTemperatureInKelvin(fakeLitraBeamLx)).toEqual(5000);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('setBrightnessInLumen', () => {
  it('sends the right instruction to set the brightness of a Litra Glow', () => {
    setBrightnessInLumen(fakeLitraGlow, 20);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to set the brightness of a Litra Beam', () => {
    setBrightnessInLumen(fakeLitraBeam, 30);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to set the brightness of a Litra Beam LX', () => {
    setBrightnessInLumen(fakeLitraBeamLx, 30);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 76, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
  it('sends the right instruction to get the brightness of a Litra Glow', () => {
    fakeLitraGlow.hid.readSync = jest
      .fn()
      .mockReturnValue([
        17, 255, 4, 49, 0, 216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

    expect(getBrightnessInLumen(fakeLitraGlow)).toEqual(216);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to get the brightness of a Litra Beam', () => {
    fakeLitraBeam.hid.readSync = jest
      .fn()
      .mockReturnValue([
        17, 255, 4, 49, 0, 216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

    expect(getBrightnessInLumen(fakeLitraBeam)).toEqual(216);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the right instruction to get the brightness of a Litra Beam LX', () => {
    fakeLitraBeamLx.hid.readSync = jest
      .fn()
      .mockReturnValue([
        17, 255, 4, 49, 0, 216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

    expect(getBrightnessInLumen(fakeLitraBeamLx)).toEqual(216);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('setBrightnessPercentage', () => {
  it("sends the right instruction to set a Litra Glow's brightness based on a percentage", () => {
    setBrightnessPercentage(fakeLitraBeam, 100);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 76, 1, 144, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it("sends the right instruction to set a Litra Beam's brightness based on a percentage", () => {
    setBrightnessPercentage(fakeLitraBeam, 100);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 76, 1, 144, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it("sends the right instruction to set a Litra Beam LX's brightness based on a percentage", () => {
    setBrightnessPercentage(fakeLitraBeamLx, 100);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 76, 1, 144, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it("sends the right instruction to set a Litra Glow's brightness to the minimum brightness when set to 0%", () => {
    setBrightnessPercentage(fakeLitraGlow, 0);

    expect(fakeLitraGlow.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it("sends the right instruction to set a Litra Beam's brightness to the minimum brightness when set to 0%", () => {
    setBrightnessPercentage(fakeLitraBeam, 0);

    expect(fakeLitraBeam.hid.write).toBeCalledWith([
      17, 255, 4, 76, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it("sends the right instruction to set a Litra Beam LX's brightness to the minimum brightness when set to 0%", () => {
    setBrightnessPercentage(fakeLitraBeamLx, 0);

    expect(fakeLitraBeamLx.hid.write).toBeCalledWith([
      17, 255, 6, 76, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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

  it('returns the correct minimum brightness for a Litra Beam LX', () => {
    expect(getMinimumBrightnessInLumenForDevice(fakeLitraBeamLx)).toEqual(30);
  });
});

describe('getMaximumBrightnessInLumenForDevice', () => {
  it('returns the correct maximum brightness for a Litra Glow', () => {
    expect(getMaximumBrightnessInLumenForDevice(fakeLitraGlow)).toEqual(250);
  });

  it('returns the correct maximum brightness for a Litra Beam', () => {
    expect(getMaximumBrightnessInLumenForDevice(fakeLitraBeam)).toEqual(400);
  });

  it('returns the correct maximum brightness for a Litra Beam LX', () => {
    expect(getMaximumBrightnessInLumenForDevice(fakeLitraBeamLx)).toEqual(400);
  });
});

describe('getMinimumTemperatureInKelvinForDevice', () => {
  it('returns the correct minimum temperature for a Litra Glow', () => {
    expect(getMinimumTemperatureInKelvinForDevice(fakeLitraGlow)).toEqual(2700);
  });

  it('returns the correct minimum temperature for a Litra Beam', () => {
    expect(getMinimumTemperatureInKelvinForDevice(fakeLitraBeam)).toEqual(2700);
  });

  it('returns the correct minimum temperature for a Litra Beam LX', () => {
    expect(getMinimumTemperatureInKelvinForDevice(fakeLitraBeamLx)).toEqual(2700);
  });
});

describe('getMaximumTemperatureInKelvinForDevice', () => {
  it('returns the correct maximum temperature for a Litra Glow', () => {
    expect(getMaximumTemperatureInKelvinForDevice(fakeLitraGlow)).toEqual(6500);
  });

  it('returns the correct maximum temperature for a Litra Beam', () => {
    expect(getMaximumTemperatureInKelvinForDevice(fakeLitraBeam)).toEqual(6500);
  });

  it('returns the correct maximum temperature for a Litra Beam LX', () => {
    expect(getMaximumTemperatureInKelvinForDevice(fakeLitraBeamLx)).toEqual(6500);
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

  it('returns the allowed temperatures for a Litra Beam LX', () => {
    expect(getAllowedTemperaturesInKelvinForDevice(fakeLitraBeamLx)).toEqual([
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

  it('returns the correct name for a Litra Beam LX', () => {
    expect(getNameForDevice(fakeLitraBeamLx)).toEqual('Logitech Litra Beam LX');
  });
});
