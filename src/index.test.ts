import { calculateElevation, convertDistance } from './index';
import { measurements } from './types';

test('Expect 1000 metres to be 0.62 miles', () => {
  expect(convertDistance(1000, measurements.miles)).toBe(0.62);
});

test('Expect 1 metre to be 3.2808 feet', () => {
  expect(calculateElevation(1, measurements.miles)).toBe(3.2808);
});
