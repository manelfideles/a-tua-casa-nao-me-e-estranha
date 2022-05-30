/**
 * This file contains all the necessary
 * config settings for the proper
 * functioning of this platform
 */

// starting position [lng, lat]
const porto = [
    -8.611946928173666,
    41.15798495442439
]

// bounding box
const bounds = [
    [-8.666783554528266, 41.133935744323],
    [-8.555236943455546, 41.18437884529454]
]

const fileIds = {
    'atms': 'blue',
    'bars': 'red',
    'bus-stops': 'yellow',
    'clinics': 'green',
    'gas-stations': 'brown',
    'gyms': 'white',
    'malls': 'grey',
    'parking': 'magenta',
    'parks': 'purple',
    'pharmacies': 'pink',
    'restaurants': 'violet',
    'schools': 'teal',
    'subway-stops': 'black',
    'supermarkets': 'black',
    'tram-stops': 'gold',
}

const userProfiles = {
    'profile1': {
        'gas-stations': 0.7,
        'gyms': 0.3,
        'malls': 0.2,
        'schools': 0.5
    },
    'profile2': {
        'gas-stations': 0.7,
        'gyms': 0.3,
        'malls': 0.2,
        'doctors-offices': 0.5
    },
    'profile3': {
        'gas-stations': 0.7,
        'gyms': 0.3,
        'malls': 0.2,
        'doctors-offices': 0.5
    },

}

// Search radius options
var radius = 0.25; // temporary
const options = {
    steps: 45,
    units: "kilometers",
};

function getAccessibilityScore(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getAverage(arr) {
    const sum = arr.reduce((ps, a) => ps + a, 0);
    return sum / arr.length;
}

// get all house coordinates
async function getHouseCoordinates(filepath) {
    const res = await fetch(filepath);
    const data = await res.json();

    // house coords
    return data.features.map(house => house.geometry.coordinates)
}

const scores = {};
const houseCoords = [
    [-8.624975681304932.toFixed(4), 41.156427338708994.toFixed(4)],
    [-8.611489534378052.toFixed(4), 41.150853345074495.toFixed(4)],
    [-8.614647835493088.toFixed(4), 41.140582626730236.toFixed(4)],
    [-8.613805621862411.toFixed(4), 41.140419009350666.toFixed(4)],
    [-8.613749295473099.toFixed(4), 41.14214606110511.toFixed(4)],
    [-8.613393902778625.toFixed(4), 41.142141011312475.toFixed(4)],
    [-8.61316055059433.toFixed(4), 41.141765305649784.toFixed(4)],
    [-8.612574487924576.toFixed(4), 41.14275102344925.toFixed(4)]
]
for (let i = 0; i < houseCoords.length; i++) {
    scores[houseCoords[i]] = [
        getAccessibilityScore(75, 99),
        getAccessibilityScore(75, 89),
        getAccessibilityScore(60, 90),
        getAccessibilityScore(60, 80),
    ];
}


export {
    porto, bounds,
    fileIds, radius,
    options, scores, getAverage
}
