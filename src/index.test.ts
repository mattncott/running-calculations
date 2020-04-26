import {
  calculateElevation,
  convertDistance,
  measurements,
  calculatePercentageVO2Max,
  calculateVDOT,
  calculateAveragePace,
} from './index';

test('Expect 1000 metres to be 0.62 miles', () => {
  expect(convertDistance(1000, measurements.miles)).toBe(0.62);
});

test('Expect 1 metre to be 3.2808 feet', () => {
  expect(calculateElevation(1, measurements.miles)).toBe(3.2808);
});

test('Expect a race time of 1:24:32 for a half marathon to be 86.4% VO2Max', () => {
  const time = convertTimeToSeconds('01:24:35');
  console.log(time);
  expect(calculatePercentageVO2Max(time)).toBe(86.43);
});

test('Expect a race time of 1:24:32 for a half marathon to have the VDOT score of 54.76', () => {
  const time = convertTimeToSeconds('01:24:35');
  expect(calculateVDOT(time, 21097.5)).toBe(54.76);
});

// INTERNAL FUNCTIONS FOR TESTING
function convertTimeToSeconds(time: string) {
  const a = time.split(':');
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
}
