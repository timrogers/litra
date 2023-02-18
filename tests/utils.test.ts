import {
  integerToBytes,
  multiplesWithinRange,
  padRight,
  percentageWithinRange,
} from '../src/utils';

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

describe('multiplesWithinRange', () => {
  it('throws an error if the number to find increments of is not an integer', () => {
    expect(() => multiplesWithinRange(4.5, 0, 1000)).toThrowError(
      'Provided value for `multiplesOf` must be an integer',
    );
  });

  it('throws an error if the number at the start of the range is not an integer', () => {
    expect(() => multiplesWithinRange(5, 0.5, 1000)).toThrowError(
      'Provided value for `startRange` must be an integer',
    );
  });

  it('throws an error if the number at the end of the range is not an integer', () => {
    expect(() => multiplesWithinRange(5, 0, 999.9)).toThrowError(
      'Provided value for `endRange` must be an integer',
    );
  });

  it('returns the correct multiples of 3 between 0 and 10', () => {
    expect(multiplesWithinRange(3, 0, 10)).toEqual([0, 3, 6, 9]);
  });

  it('returns the correct multiples of 3 between 1 and 10', () => {
    expect(multiplesWithinRange(3, 1, 10)).toEqual([3, 6, 9]);
  });

  it('returns the correct multiples of 5 between 0 and 20', () => {
    expect(multiplesWithinRange(5, 0, 20)).toEqual([0, 5, 10, 15, 20]);
  });

  it('returns the correct multiples of 3 between 10 and 20', () => {
    expect(multiplesWithinRange(3, 10, 20)).toEqual([12, 15, 18]);
  });
});
