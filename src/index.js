"use strict";
exports.__esModule = true;
var types_1 = require("./types");
/**
 * Convert elevation in metres
 * @param elevation
 * @param measurement
 */
function calculateElevation(elevation, measurement) {
    switch (measurement) {
        case types_1.measurements.kilometers:
            return elevation;
        case types_1.measurements.miles:
            return elevation * 3.2808;
        default:
            throw new Error("Unsupported Measurement");
    }
}
exports.calculateElevation = calculateElevation;
/**
 * Calculate speed in metres per second from 2 longitudinal and latitudinal coordinates
 * @param start
 * @param end
 */
function speedFromCoordinates(start, end) {
    var lat1 = start['lat'];
    var lat2 = end['lat'];
    var lon1 = start['lng'];
    var lon2 = end['lng'];
    // Convert degrees to radians
    lat1 = lat1 * Math.PI / 180.0;
    lon1 = lon1 * Math.PI / 180.0;
    lat2 = lat2 * Math.PI / 180.0;
    lon2 = lon2 * Math.PI / 180.0;
    // radius of earth in metres
    var r = 6378100;
    // P
    var rho1 = r * Math.cos(lat1);
    var z1 = r * Math.sin(lat1);
    var x1 = rho1 * Math.cos(lon1);
    var y1 = rho1 * Math.sin(lon1);
    // Q
    var rho2 = r * Math.cos(lat2);
    var z2 = r * Math.sin(lat2);
    var x2 = rho2 * Math.cos(lon2);
    var y2 = rho2 * Math.sin(lon2);
    // Dot product
    var dot = (x1 * x2 + y1 * y2 + z1 * z2);
    var cos_theta = dot / (r * r);
    var theta = Math.acos(cos_theta);
    // Distance in Metres
    return r * theta;
}
exports.speedFromCoordinates = speedFromCoordinates;
/**
 * Calculate Efficiency Factor of a run from Normalised Graded Pace and Heart Rate
 * @param ngp
 * @param hr
 */
function calculateEfficiencyFactor(ngp, hr) {
    if (hr === null) {
        return null;
    }
    var ngs = 60 / ngp;
    var yardsPerMinute = 1760 * ngs / 60;
    var ef = yardsPerMinute / hr;
    return Math.round((ef + Number.EPSILON) * 100) / 100;
}
exports.calculateEfficiencyFactor = calculateEfficiencyFactor;
/**
 * Convert distance in metres to miles/kilometers. Rounded to 2 dp
 * @param metres: number
 * @param measurements: measurements
 */
function convertDistance(metres, measure) {
    var answer = null;
    if (measure === types_1.measurements.kilometers) {
        answer = metres / 1000;
    }
    else if (measure === types_1.measurements.miles) {
        answer = Math.round(((metres * 0.00062137) + Number.EPSILON) * 100) / 100;
    }
    else {
        throw new Error("Unsupported Measurement");
    }
    return Math.round((answer + Number.EPSILON) * 100) / 100;
}
exports.convertDistance = convertDistance;
/**
 * Calculate average pace in time from ms
 * @param time
 * @param measurements
 */
function calculateAveragePace(time, measure) {
    var converted = null;
    if (isNaN(time)) {
        return null;
    }
    if (measure === types_1.measurements.kilometers) {
        converted = time * 3.6;
    }
    else if (measure === types_1.measurements.miles) {
        converted = convertToMPH(time);
    }
    else {
        throw new Error("Unsupported Measurement");
    }
    var num = 60 / converted;
    var intpart = Math.floor(num);
    var fraction = num - intpart;
    var seconds = fraction * 60;
    seconds = Math.round(seconds);
    return intpart + ":" + pad(seconds);
}
exports.calculateAveragePace = calculateAveragePace;
/**
 *
 * Convert Running pace to metres per second
 *
 * @param pace
 * @param measurements the pace this is in
 */
function reverseAveragePace(pace, measure) {
    var hms = '00:' + pace;
    var a = hms.split(':');
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var time = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    var distance = 1000; // 1 kilometre
    switch (measure) {
        case types_1.measurements.miles:
            distance = 1609.34; // 1 mile in metres
            break;
        case types_1.measurements.kilometers:
            break;
        default:
            throw new Error('Unsupported measurement');
    }
    return (distance / time);
}
exports.reverseAveragePace = reverseAveragePace;
/**
 * Calculate training pace zones from Functional Threshold Pace or Lactate Threshold Pace
 *
 * @param ftp ftp in metres per second
 */
function calculateZonesFromFTP(ftp) {
    var zones = [];
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
exports.calculateZonesFromFTP = calculateZonesFromFTP;
// INTERNAL FUNCTIONS
/**
 * Pad a number into a string with prepended 0 if required
 * @param num
 */
function pad(num) {
    return ("0" + num).slice(-2);
}
/**
 * Convert metres per second to mph
 * @param $metres
 */
function convertToMPH($metres) {
    return ($metres * 2.2369);
}
