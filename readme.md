# Running Calculations

A project containing functions to analyse a runners training data (from a specific run).

## Getting Started

These instructions will get you a copy of the project up and running in your projects. 

### Prerequisites

There are no prerequisites required for this project,

### Installing
running-calculations can be used in both node.js and in the browser.

Install math.js using [npm](https://www.npmjs.com/package/running-calculations):
```
npm install running-calculations
```

## Usage
Using Running Calculations is incredibly simple. Examples of every function in use can be seen below:

### Types

#### Measurements
Enumeration of supported measurement types in this system

#### Possibilities
```typescript
    measurements.miles
    measurments.kilometres
```

### Coordinates
Typically used for an array of coordinates. Each object will have a longitude (lng) and latitude (lat) point. 

#### Example

```typescript
    import { coordinate } from 'running-calculations';
    const coordinatesArr:coordinate[] = [
        {
            lat: [latitude coordinate],
            lng: [longitude coordinate]
        }
    ]
```

### Calculate Elevation
Converts elevation in metres to feet.

#### Example

```typescript
    import { calculateElevation, measurements } from 'running-calculations';
    const elevation = calculateElevation(1, measurements.miles); // Answer will be 3.2808
```

### Calculate running speed from 2 coordinates
Returns speed (in metres per second) from 2 coordinate types

```typescript
    import { speedFromCoordinates, coordinates } from 'running-calculations';

    const coords1:coordinates = {lat: [latitude], lng: [longitude]};
    const coords2:coordinates = {lat: [latitude], lng: [longitude]};
    const speed = speedFromCoordinates(coords1, coords2);
```

### Calculate running efficiency factor
Returns an efficiency factor from a running pace (ideally a graded pace) and a heart rate value. For comparison reasons, this would ideally be used for runs on the same course and conditions (time, weather, etc).

NOTE: Speed value is in metres per second.

```typescript
    import { calculateEfficiencyFactor } from 'running-calculations';
    const runningPace = 4.76;
    const heartrate = 150;
    const speed = calculateEfficiencyFactor(runningPace, heartrate);
```

### Convert distance from metres
Convert a distance in metres to either miles or kilometres

```typescript
    import { convertDistance, measurements } from 'running-calculations';
    const distance = 1000;
    const speed = convertDistance(distance, measurements.miles);
```

### Calculate a running pace

Converts running pace from metres per second to minute/miles or minute/kilometres

```typescript
    import { calculateAveragePace, measurements } from 'running-calculations';
    const pace = 4.76;
    const speed = calculateAveragePace(pace, measurements.miles);
```

### Calculate a running pace to m/s

Converts running pace from minute/miles or minute/kilometres to metres per second

```typescript
    import { reverseAveragePace, measurements } from 'running-calculations';
    const pace = '6:18';
    const speed = reverseAveragePace(pace, measurements.miles);
```

### Using FTP calculate training zones.
Uses functional threshold pace to calculate training zones for a runner to train in.

```typescript
    import { calculateZonesFromFTP } from 'running-calculations';
    const pace = 4.76;
    const speed = calculateZonesFromFTP(pace);
```

### Calculating percentage of VO2 MAX
Using the finish time for a race, calculate the % of VO2 Max. 
Calculation from the Jack Daniels Tables

```typescript
    import { calculatePercentageVO2Max } from 'running-calculations';
    const raceTime = 5075; // 1:24:35 in seconds
    const VO2Max = calculatePercentageVO2Max(raceTime); // 86.4 %
```

### Calculating VDot score from a race performance
Using the finish time for a race, calculate the VDot score of the race.
Calculation from the Jack Daniels Tables

```typescript
    import { calculateVDOT } from 'running-calculations';
    const raceTime = 5075; // 1:24:35 in seconds
    const VO2Max = calculateVDOT(raceTime); // 54.76 VDot Score
```

## Running the tests

```
npm run test
```
## Contributing

To contribute on this project, please contact [mattncott](https://github.com/mattncott).

## Authors

* **Matthew Nethercott** - *Initial work* - [mattncott](https://github.com/mattncott)

See also the list of [contributors](https://github.com/running-calculations/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details