import {
  setBrightnessInLumen,
  setBrightnessPercentage,
  setTemperatureInKelvin,
  setTemperaturePercentage,
  turnOff,
  turnOn,
} from '../src/driver';

describe('turnOn', () => {
  it('sends the instruction to turn the device on', () => {
    const fakeDevice = { write: jest.fn() };

    turnOn(fakeDevice);

    expect(fakeDevice.write).toBeCalledWith([
      17, 255, 4, 28, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('turnOff', () => {
  it('sends the instruction to turn the device off', () => {
    const fakeDevice = { write: jest.fn() };

    turnOff(fakeDevice);

    expect(fakeDevice.write).toBeCalledWith([
      17, 255, 4, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe('setTemperatureInKelvin', () => {
  it('sends the instruction to set the device temperature', () => {
    const fakeDevice = { write: jest.fn() };

    setTemperatureInKelvin(fakeDevice, 6300);

    expect(fakeDevice.write).toBeCalledWith([
      17, 255, 4, 156, 24, 156, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the temperature is below the minimum', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setTemperatureInKelvin(fakeDevice, 2699)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );
  });

  it('throws an error if the temperature is above the maximum', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setTemperatureInKelvin(fakeDevice, 6501)).toThrowError(
      'Provided temperature must be between 2700 and 6500',
    );
  });

  it('throws an error if the temperature is not an integer', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setTemperatureInKelvin(fakeDevice, 1337.9)).toThrowError(
      'Provided temperature must be an integer',
    );
  });
});

describe('setTemperaturePercentage', () => {
  it('sends the instruction to set the device temperature based on a percentage', () => {
    const fakeDevice = { write: jest.fn() };

    setTemperaturePercentage(fakeDevice, 100);

    expect(fakeDevice.write).toBeCalledWith([
      17, 255, 4, 156, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the instruction to set the device temperature to the minimum temperature when set to 0%', () => {
    const fakeDevice = { write: jest.fn() };

    setTemperaturePercentage(fakeDevice, 0);

    expect(fakeDevice.write).toBeCalledWith([
      17, 255, 4, 156, 10, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the provided percentage is less than 0', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setTemperaturePercentage(fakeDevice, -1)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });

  it('throws an error if the provided percentage is more than 100', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setTemperaturePercentage(fakeDevice, 101)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });
});

describe('setBrightnessInLumen', () => {
  it('sends the instruction to set the device temperature', () => {
    const fakeDevice = { write: jest.fn() };

    setBrightnessInLumen(fakeDevice, 20);

    expect(fakeDevice.write).toBeCalledWith([
      17, 255, 4, 76, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the brightness is below the minimum', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setBrightnessInLumen(fakeDevice, 19)).toThrowError(
      'Provided brightness must be between 20 and 250',
    );
  });

  it('throws an error if the brightness is above the maximum', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setBrightnessInLumen(fakeDevice, 251)).toThrowError(
      'Provided brightness must be between 20 and 250',
    );
  });

  it('throws an error if the brightness is not an integer', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setBrightnessInLumen(fakeDevice, 1337.9)).toThrowError(
      'Provided brightness must be an integer',
    );
  });
});

describe('setBrightnessPercentage', () => {
  it('sends the instruction to set the device brightness based on a percentage', () => {
    const fakeDevice = { write: jest.fn() };

    setBrightnessPercentage(fakeDevice, 100);

    expect(fakeDevice.write).toBeCalledWith([
      17, 255, 4, 76, 0, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('sends the instruction to set the device brightness to the minimum brightness when set to 0%', () => {
    const fakeDevice = { write: jest.fn() };

    setBrightnessPercentage(fakeDevice, 0);

    expect(fakeDevice.write).toBeCalledWith([
      17, 255, 4, 76, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('throws an error if the provided percentage is less than 0', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setBrightnessPercentage(fakeDevice, -1)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });

  it('throws an error if the provided percentage is more than 100', () => {
    const fakeDevice = { write: jest.fn() };

    expect(() => setBrightnessPercentage(fakeDevice, 101)).toThrowError(
      'Percentage must be between 0 and 100',
    );
  });
});
