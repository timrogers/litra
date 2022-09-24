import { integerToBytes, padRight, percentageWithinRange } from '../src/utils';

describe('integerToBytes', () => {
  it('converts the provided integer into an array of two bytes', () => {
    expect(integerToBytes(4000)).toEqual([15, 160]);
  });

  it('throws an error if the parameter is not an integer', () => {
    expect(() => integerToBytes(1337.9)).toThrowError(
      'Provided value must be an integer',
    );
  });
});

describe('padRight', () => {
  it('adds the specified element to the end of the array to make it the requested length', () => {
    expect(padRight(['foo'], 3, 'bar')).toEqual(['foo', 'bar', 'bar']);
  });

  it('does nothing if the array already has exactly the required number of elements', () => {
    expect(padRight(['foo', 'bar'], 2, 'baz')).toEqual(['foo', 'bar']);
  });

  it('does nothing if the array already has more than the required number of elements', () => {
    expect(padRight(['foo', 'bar', 'bang'], 2, 'baz')).toEqual(['foo', 'bar', 'bang']);
  });
});

describe('percentageWithinRange', () => {
  it('maps the percentage within the range', () => {
    expect(percentageWithinRange(50, 1, 100)).toEqual(50);
    expect(percentageWithinRange(25, 1, 200)).toEqual(50);
    expect(percentageWithinRange(50, 1, 200)).toEqual(100);
  });
});
