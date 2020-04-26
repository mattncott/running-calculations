export enum measurements {
  miles = 'Miles',
  kilometers = 'Kilometers',
}

export type coordinate = {
  lat: number;
  lng: number;
};

/**
 * Calculate a VDot score from a recent performance.
 *
 * Takes race time in seconds and race distance in metres.
 *
 * Based on the calulcations in the Jack Daniels Tables
 *
 * @param raceTime in seconds
 * @param raceDistance in metres
 * @return number
 */
export function calculateVDOT(raceTime: number, raceDistance: number): number {
  // Will be converted to minutes inside the function call
  const VO2Max = calculatePercentageVO2Max(raceTime, false);
  raceTime = raceTime / 60;
  const vDOT = (-4.6 + 0.182258 * (raceDistance / raceTime) + 0.000104 * Math.pow(raceDistance / raceTime, 2)) / VO2Max;

  return Math.round((vDOT + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate the VO2Max of a runner from a performance.
 * Calculation translated from the Jack Daniels Tables
 *
 * The format toggle is required for some other functions.
 * Some are looking for VO2Max before, it is converted into a decimal
 *
 * If formatted, percentage is rounded to 2 decimal places
 * @param raceTime number
 * @param format boolean return in percentage or decimal
 * @return number
 */
export function calculatePercentageVO2Max(raceTime: number, format: boolean): number {
  // Equation from JackDaniels Tables
  // The JackDaniels function is expecting the raceTime to be in minutes
  raceTime = raceTime / 60;
  const percentageVO2Max =
    0.8 + 0.1894393 * Math.exp(-0.012778 * raceTime) + 0.2989558 * Math.exp(-0.1932605 * raceTime);

  if (format) {
    return Math.round((percentageVO2Max * 100 + Number.EPSILON) * 100) / 100;
  }

  return percentageVO2Max;
}

/**
 * Convert elevation in metres
 * @param elevation
 * @param measurement
 * @throws Error
 */
export function calculateElevation(elevation: number, measurement: measurements): number {
  switch (measurement) {
    case measurements.kilometers:
      return elevation;
    case measurements.miles:
      return elevation * 3.2808;
    default:
      throw new Error('Unsupported Measurement');
  }
}

/**
 * Calculate speed in metres per second from 2 longitudinal and latitudinal coordinates
 * @param start
 * @param end
 */
export function speedFromCoordinates(start: coordinate, end: coordinate): number {
  let lat1 = start.lat;
  let lat2 = end.lat;

  let lon1 = start.lng;
  let lon2 = end.lng;

  // Convert degrees to radians
  lat1 = (lat1 * Math.PI) / 180.0;
  lon1 = (lon1 * Math.PI) / 180.0;

  lat2 = (lat2 * Math.PI) / 180.0;
  lon2 = (lon2 * Math.PI) / 180.0;

  // radius of earth in metres
  const r = 6378100;

  // P
  const rho1 = r * Math.cos(lat1);
  const z1 = r * Math.sin(lat1);
  const x1 = rho1 * Math.cos(lon1);
  const y1 = rho1 * Math.sin(lon1);

  // Q
  const rho2 = r * Math.cos(lat2);
  const z2 = r * Math.sin(lat2);
  const x2 = rho2 * Math.cos(lon2);
  const y2 = rho2 * Math.sin(lon2);

  // Dot product
  const dot = x1 * x2 + y1 * y2 + z1 * z2;
  const cosTheta = dot / (r * r);

  const theta = Math.acos(cosTheta);

  // Distance in Metres
  return r * theta;
}

/**
 * Calculate Efficiency Factor of a run from Normalised Graded Pace and Heart Rate
 * @param ngp
 * @param hr
 * @return number or null
 */
export function calculateEfficiencyFactor(ngp: any, hr: any): number | null {
  if (hr === null) {
    return null;
  }

  const ngs = 60 / ngp;
  const yardsPerMinute = (1760 * ngs) / 60;
  const ef = yardsPerMinute / hr;
  return Math.round((ef + Number.EPSILON) * 100) / 100;
}

/**
 * Convert distance in metres to miles/kilometers. Rounded to 2 dp
 * @param metres: number
 * @param measurements: measurements
 * @throws Error
 */
export function convertDistance(metres: number, measure: measurements): number {
  let answer = null;
  if (measure === measurements.kilometers) {
    answer = metres / 1000;
  } else if (measure === measurements.miles) {
    answer = Math.round((metres * 0.00062137 + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Unsupported Measurement');
  }

  return Math.round((answer + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate average pace in time from ms
 * @param time
 * @param measurements
 * @throws Error
 */
export function calculateAveragePace(time: number, measure: measurements): string {
  let converted = null;
  if (isNaN(time)) {
    throw new Error('Time must be a number');
  }
  if (measure === measurements.kilometers) {
    converted = time * 3.6;
  } else if (measure === measurements.miles) {
    converted = convertToMPH(time);
  } else {
    throw new Error('Unsupported Measurement');
  }

  const num = 60 / converted;
  const intpart = Math.floor(num);

  const fraction = num - intpart;
  let seconds = fraction * 60;

  seconds = Math.round(seconds);

  return intpart + ':' + pad(seconds);
}

/**
 *
 * Convert Running pace to metres per second
 *
 * @param pace
 * @param measurements the pace this is in
 * @throws Error
 */
export function reverseAveragePace(pace: string, measure: measurements): number {
  const hms = '00:' + pace;
  const a = hms.split(':');
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  const time = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

  let distance = 1000; // 1 kilometre

  switch (measure) {
    case measurements.miles:
      distance = 1609.34; // 1 mile in metres
      break;
    case measurements.kilometers:
      break;
    default:
      throw new Error('Unsupported measurement');
  }

  return distance / time;
}

/**
 * Calculate training pace zones from Functional Threshold Pace or Lactate Threshold Pace
 *
 * @param ftp ftp in metres per second
 */
export function calculateZonesFromFTP(ftp: number): any[] {
  const zones = [];

  // [upperZoneBound, lowerZoneBound]
  zones.push([ftp * 0.9, null]); // Zone 1
  zones.push([ftp * 0.96, ftp * 0.9]); // Zone 2
  zones.push([ftp * 1, ftp * 0.9]); // Zone 3
  zones.push([ftp * 1.05, ftp * 0.99]); // sweetspot
  zones.push([ftp * 1.06, ftp * 0.99]); // Zone 4
  zones.push([ftp * 1.13, ftp * 1.06]); // Zone 5
  zones.push([ftp * 1.29, ftp * 1.14]); // Zone 6
  zones.push([null, ftp * 1.29]); // Zone 7
  return zones;
}

// INTERNAL FUNCTIONS
/**
 * Pad a number into a string with prepended 0 if required
 * @param num
 */
function pad(num: number) {
  return ('0' + num).slice(-2);
}

/**
 * Convert metres per second to mph
 * @param $metres
 */
function convertToMPH($metres: number) {
  return $metres * 2.2369;
}
