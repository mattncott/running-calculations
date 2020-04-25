"use strict";
exports.__esModule = true;
var index_1 = require("./index");
test('Expect 1000 metres to be 0.62 miles', function () {
    expect(index_1.convertDistance(1000, index_1.measurements.miles)).toBe(0.62);
});
test('Expect 1 metre to be 3.2808 feet', function () {
    expect(index_1.calculateElevation(1, index_1.measurements.miles)).toBe(3.2808);
});
