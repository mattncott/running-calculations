import {
  calculateElevation,
  convertDistance,
  measurements,
  calculatePercentageVO2Max,
  calculateVDOT,
  calculateAveragePace,
  reverseAveragePace,
  calculateEfficiencyFactor,
  calculateIntensityFactor,
  calculateTrainingStressScore,
  calculateChronicTrainingLoad,
  calculateAcuteTrainingLoad,
  calculateTrainingStressBalance,
} from './index';

test('Expect 6:18 to be the correct time once reversed', () => {
  const time = reverseAveragePace('6:18', measurements.miles);
  expect(calculateAveragePace(time, measurements.miles)).toBe('6:18');

});

test('Expect 1000 metres to be 0.62 miles', () => {
  expect(convertDistance(1000, measurements.miles)).toBe(0.62);
});

test('Expect 1 metre to be 3.2808 feet', () => {
  expect(calculateElevation(1, measurements.miles)).toBe(3.2808);
});

test('Expect a race time of 1:24:32 for a half marathon to be 86.4% VO2Max', () => {
  const time = convertTimeToSeconds('01:24:35');
  expect(calculatePercentageVO2Max(time)).toBe(86.43);
});

test('Expect a race time of 1:24:32 for a half marathon to have the VDOT score of 54.76', () => {
  const time = convertTimeToSeconds('01:24:35');
  expect(calculateVDOT(time, 21097.5)).toBe(54.76);
});

test('Expect the efficiency factor of a run with a pace of 6:28 and a heart rate of 163.9 to be 1.56', () => {
  expect(calculateEfficiencyFactor('7:30', 150)).toBe(1.56);
});

test('Expect the intensity factor of a run to be 0.97 when your FTP is 6:18 and NGP is 0.97', () => {
  const ngp = reverseAveragePace('6:28', measurements.miles);
  const ftp = reverseAveragePace('6:18', measurements.miles);

  expect(calculateIntensityFactor(ftp, ngp)).toBe(0.97);
});

test('Expect a half marathon with the pace of average pace of 6:28 and an FTP of 6:18 to be 133.8', () => {
  const ngp = reverseAveragePace('6:28', measurements.miles);
  const ftp = reverseAveragePace('6:18', measurements.miles);
  const time = convertTimeToSeconds('01:24:35');

  expect(calculateTrainingStressScore(ftp, ngp, time)).toBe(133.8);
});

test('Expect the chronic training load to be: 49.35', () => {
  const ftp = reverseAveragePace('6:18', measurements.miles);

  const tssData: number[] = [];
  monthRuns.forEach((run) => {
    tssData.push(calculateTrainingStressScore(ftp, run.average_speed, run.elapsed_time));
  });

  expect(calculateChronicTrainingLoad(tssData)).toBe(49.35);
});

test('Expect the acute training load to be: 43.62', () => {
  const ftp = reverseAveragePace('6:18', measurements.miles);

  const tssData: number[] = [];
  weekRuns.forEach((run) => {
    tssData.push(calculateTrainingStressScore(ftp, run.average_speed, run.elapsed_time));
  });

  expect(calculateAcuteTrainingLoad(tssData)).toBe(43.62);
});

test('Expect the training stress balance to be 5.73', () => {
  const ftp = reverseAveragePace('6:18', measurements.miles);

  const weekTSS: number[] = [];
  weekRuns.forEach((run) => {
    weekTSS.push(calculateTrainingStressScore(ftp, run.average_speed, run.elapsed_time));
  });

  const monthTSS: number[] = [];
  monthRuns.forEach((run) => {
    monthTSS.push(calculateTrainingStressScore(ftp, run.average_speed, run.elapsed_time));
  });

  const ctl = calculateChronicTrainingLoad(monthTSS);
  const atl = calculateAcuteTrainingLoad(weekTSS);

  expect(calculateTrainingStressBalance(ctl, atl)).toBe(5.73);
});

// INTERNAL FUNCTIONS FOR TESTING
function convertTimeToSeconds(time: string) {
  const a = time.split(':');
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
}

// Strava activities from the past 42 days from 27th Apr 2020
const monthRuns = [
  {
    id: 386,
    device_id: 1,
    workout_type: 1,
    type: 1,
    moving_time: 2580,
    elapsed_time: 2648,
    total_elevation_gain: 63.7,
    average_heartrate: 169.8,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.516,
    max_speed: 5.1,
    start_date: '2020-04-22T16:46:27Z',
    utc_offset: 3600,
    map: null,
    distance: 9071.8,
    user: 5,
  },
  {
    id: 387,
    device_id: 2,
    workout_type: 1,
    type: 1,
    moving_time: 1925,
    elapsed_time: 1979,
    total_elevation_gain: 39,
    average_heartrate: 162.6,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.496,
    max_speed: 5.4,
    start_date: '2020-04-21T16:33:44Z',
    utc_offset: 3600,
    map: null,
    distance: 6730.2,
    user: 5,
  },
  {
    id: 388,
    device_id: 3,
    workout_type: 1,
    type: 1,
    moving_time: 2853,
    elapsed_time: 2914,
    total_elevation_gain: 71.6,
    average_heartrate: 155,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.402,
    max_speed: 5,
    start_date: '2020-04-18T16:42:26Z',
    utc_offset: 3600,
    map: null,
    distance: 9705.1,
    user: 5,
  },
  {
    id: 389,
    device_id: 5,
    workout_type: 1,
    type: 1,
    moving_time: 3712,
    elapsed_time: 3737,
    total_elevation_gain: 92.4,
    average_heartrate: 163.4,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.47,
    max_speed: 4.7,
    start_date: '2020-04-16T16:41:36Z',
    utc_offset: 3600,
    map: null,
    distance: 12879.3,
    user: 5,
  },
  {
    id: 390,
    device_id: 7,
    workout_type: 1,
    type: 1,
    moving_time: 2947,
    elapsed_time: 3015,
    total_elevation_gain: 86.8,
    average_heartrate: 168.9,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.635,
    max_speed: 5.6,
    start_date: '2020-04-14T16:40:14Z',
    utc_offset: 3600,
    map: null,
    distance: 10712.6,
    user: 5,
  },
  {
    id: 391,
    device_id: 8,
    workout_type: 1,
    type: 1,
    moving_time: 3722,
    elapsed_time: 3768,
    total_elevation_gain: 98.8,
    average_heartrate: 167.6,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.496,
    max_speed: 4.5,
    start_date: '2020-04-12T14:04:03Z',
    utc_offset: 3600,
    map: null,
    distance: 13012.3,
    user: 5,
  },
  {
    id: 392,
    device_id: 9,
    workout_type: 1,
    type: 1,
    moving_time: 4767,
    elapsed_time: 4834,
    total_elevation_gain: 128,
    average_heartrate: 171.6,
    activity_name: 'Lunch Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.507,
    max_speed: 4.7,
    start_date: '2020-04-11T11:26:46Z',
    utc_offset: 3600,
    map: null,
    distance: 16715.6,
    user: 5,
  },
  {
    id: 393,
    device_id: 10,
    workout_type: 1,
    type: 1,
    moving_time: 2762,
    elapsed_time: 2780,
    total_elevation_gain: 70.4,
    average_heartrate: 164.1,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.518,
    max_speed: 4.7,
    start_date: '2020-04-10T14:14:49Z',
    utc_offset: 3600,
    map: null,
    distance: 9716.2,
    user: 5,
  },
  {
    id: 394,
    device_id: 11,
    workout_type: 1,
    type: 1,
    moving_time: 2684,
    elapsed_time: 2777,
    total_elevation_gain: 66.6,
    average_heartrate: 163.7,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.607,
    max_speed: 5.3,
    start_date: '2020-04-08T16:36:16Z',
    utc_offset: 3600,
    map: null,
    distance: 9681.3,
    user: 5,
  },
  {
    id: 395,
    device_id: 12,
    workout_type: 1,
    type: 1,
    moving_time: 2082,
    elapsed_time: 2092,
    total_elevation_gain: 34.5,
    average_heartrate: 161.3,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.696,
    max_speed: 4.6,
    start_date: '2020-04-07T16:55:26Z',
    utc_offset: 3600,
    map: null,
    distance: 7695.7,
    user: 5,
  },
  {
    id: 396,
    device_id: 13,
    workout_type: 1,
    type: 1,
    moving_time: 2162,
    elapsed_time: 2162,
    total_elevation_gain: 34.7,
    average_heartrate: 173.8,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.563,
    max_speed: 4.7,
    start_date: '2020-04-05T15:48:36Z',
    utc_offset: 3600,
    map: null,
    distance: 7704.1,
    user: 5,
  },
  {
    id: 397,
    device_id: 14,
    workout_type: 1,
    type: 1,
    moving_time: 135,
    elapsed_time: 135,
    total_elevation_gain: 0,
    average_heartrate: 170.5,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.126,
    max_speed: 3.6,
    start_date: '2020-04-04T15:05:29Z',
    utc_offset: 3600,
    map: null,
    distance: 422,
    user: 5,
  },
  {
    id: 398,
    device_id: 15,
    workout_type: 1,
    type: 1,
    moving_time: 178,
    elapsed_time: 233,
    total_elevation_gain: 0,
    average_heartrate: 185.3,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 4.488,
    max_speed: 6.7,
    start_date: '2020-04-04T15:00:07Z',
    utc_offset: 3600,
    map: null,
    distance: 798.9,
    user: 5,
  },
  {
    id: 399,
    device_id: 16,
    workout_type: 1,
    type: 1,
    moving_time: 2821,
    elapsed_time: 2824,
    total_elevation_gain: 33.8,
    average_heartrate: 174.7,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.588,
    max_speed: 5.4,
    start_date: '2020-04-04T14:11:05Z',
    utc_offset: 3600,
    map: null,
    distance: 10121.1,
    user: 5,
  },
  {
    id: 400,
    device_id: 17,
    workout_type: 1,
    type: 1,
    moving_time: 2378,
    elapsed_time: 2382,
    total_elevation_gain: 39.7,
    average_heartrate: 174.9,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.539,
    max_speed: 6.2,
    start_date: '2020-04-02T16:39:50Z',
    utc_offset: 3600,
    map: null,
    distance: 8415.8,
    user: 5,
  },
  {
    id: 401,
    device_id: 18,
    workout_type: 1,
    type: 1,
    moving_time: 1481,
    elapsed_time: 1498,
    total_elevation_gain: 29.5,
    average_heartrate: 164,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.994,
    max_speed: 5.5,
    start_date: '2020-03-31T16:47:03Z',
    utc_offset: 3600,
    map: null,
    distance: 5915.4,
    user: 5,
  },
  {
    id: 402,
    device_id: 19,
    workout_type: 1,
    type: 1,
    moving_time: 1631,
    elapsed_time: 1631,
    total_elevation_gain: 29.9,
    average_heartrate: 173.1,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.623,
    max_speed: 6.1,
    start_date: '2020-03-28T14:41:04Z',
    utc_offset: 0,
    map: null,
    distance: 5909.4,
    user: 5,
  },
  {
    id: 403,
    device_id: 20,
    workout_type: 1,
    type: 1,
    moving_time: 1596,
    elapsed_time: 1599,
    total_elevation_gain: 29.1,
    average_heartrate: 163.9,
    activity_name: 'Lunch Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.645,
    max_speed: 5,
    start_date: '2020-03-27T12:25:52Z',
    utc_offset: 0,
    map: null,
    distance: 5818,
    user: 5,
  },
  {
    id: 404,
    device_id: 21,
    workout_type: 1,
    type: 1,
    moving_time: 2032,
    elapsed_time: 2132,
    total_elevation_gain: 34.1,
    average_heartrate: 165,
    activity_name: 'Lunch Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.472,
    max_speed: 6.7,
    start_date: '2020-03-25T12:03:31Z',
    utc_offset: 0,
    map: null,
    distance: 7054.9,
    user: 5,
  },
  {
    id: 405,
    device_id: 22,
    workout_type: 1,
    type: 1,
    moving_time: 6372,
    elapsed_time: 6372,
    total_elevation_gain: 86.6,
    average_heartrate: 158.5,
    activity_name: 'Morning Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.424,
    max_speed: 4.1,
    start_date: '2020-03-22T09:40:00Z',
    utc_offset: 0,
    map: null,
    distance: 21818.2,
    user: 5,
  },
  {
    id: 406,
    device_id: 23,
    workout_type: 1,
    type: 1,
    moving_time: 609,
    elapsed_time: 613,
    total_elevation_gain: 3,
    average_heartrate: 153.2,
    activity_name: 'Morning Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.271,
    max_speed: 3.7,
    start_date: '2020-03-21T09:51:08Z',
    utc_offset: 0,
    map: null,
    distance: 1992.1,
    user: 5,
  },
  {
    id: 407,
    device_id: 24,
    workout_type: 1,
    type: 1,
    moving_time: 1803,
    elapsed_time: 2138,
    total_elevation_gain: 2.9,
    average_heartrate: 170.3,
    activity_name: 'Morning Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.89,
    max_speed: 5.9,
    start_date: '2020-03-21T08:55:12Z',
    utc_offset: 0,
    map: null,
    distance: 7013.4,
    user: 5,
  },
  {
    id: 408,
    device_id: 25,
    workout_type: 1,
    type: 1,
    moving_time: 4716,
    elapsed_time: 4719,
    total_elevation_gain: 56.4,
    average_heartrate: 159,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.415,
    max_speed: 4.5,
    start_date: '2020-03-19T17:42:49Z',
    utc_offset: 0,
    map: null,
    distance: 16103.1,
    user: 5,
  },
];
const weekRuns = [
  {
    id: 386,
    device_id: 1,
    workout_type: 1,
    type: 1,
    moving_time: 2580,
    elapsed_time: 2648,
    total_elevation_gain: 63.7,
    average_heartrate: 169.8,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.516,
    max_speed: 5.1,
    start_date: '2020-04-22T16:46:27Z',
    utc_offset: 3600,
    map: null,
    distance: 9071.8,
    user: 5,
  },
  {
    id: 387,
    device_id: 2,
    workout_type: 1,
    type: 1,
    moving_time: 1925,
    elapsed_time: 1979,
    total_elevation_gain: 39,
    average_heartrate: 162.6,
    activity_name: 'Afternoon Run',
    lng_lat_start: null,
    lng_lat_end: null,
    average_speed: 3.496,
    max_speed: 5.4,
    start_date: '2020-04-21T16:33:44Z',
    utc_offset: 3600,
    map: null,
    distance: 6730.2,
    user: 5,
  },
];
