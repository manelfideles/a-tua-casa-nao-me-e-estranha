// GLOBALS ------------

const porto = [
    -8.611946928173666,
    41.15798495442439
] // starting position [lng, lat]

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
    'subway-stops': 'mustard',
    'supermarkets': 'black',
    'tram-stops': 'gold',
}

// Search radius options
var radius = 0.5;
const options = {
    steps: 30,
    units: "kilometers",
};

mapboxgl.accessToken = 'pk.eyJ1IjoiZmlkZWxlcyIsImEiOiJjbDJoYzJoeGQwNjdvM25vN29tY2k5Y2tsIn0.JuCva4gmqFcpFPI7zQRQ1g';

// ------------------------

// FUNCTIONS --------------
function loadGeoJson(map, poi_id, color, draw) {
    map.addSource(poi_id, {
        type: 'geojson',
        data: `http://127.0.0.1:5500/a-tua-casa-nao-me-e-estranha/datasets/${poi_id}.geojson`
    })
    if (draw) {
        map.addLayer({
            'id': `${poi_id}-layer`,
            'type': 'circle',
            'source': poi_id,
            'paint': {
                'circle-radius': 2,
                'circle-color': color,
            }
        });
    }
}

function drawSearchRadius(index, map, center, options) {
    console.log('Center point of', index, ': ', center);
    const searchRadius = turf.circle(center, radius, options);

    map.addSource(`circleData-${index}`, {
        type: 'geojson',
        data: searchRadius
    });
}

function drawHouses(map) {
    // houses
    loadGeoJson(map, 'houses', 'white', false);
    map.addLayer({
        'id': 'houses-layer',
        'type': 'circle',
        'source': 'houses',
        'paint': {
            'circle-radius': 5,
            'circle-color': 'lightgreen',
            'circle-stroke-width': 2,
            'circle-stroke-color': 'white'
        }
    });

    // popup
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
    });
    map.on('click', 'houses-layer', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        popup.setLngLat(coordinates).setHTML(coordinates).addTo(map);
        // lookup das coordenadas no dataset que tem a info para o popup
        // display
    })

    // draw radius on hover
    map.on('mouseenter', 'houses-layer', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const center = e.features[0].geometry.coordinates.slice();
        const searchRadius = turf.circle(center, radius, options);
        if (!map.getSource('radius-data'))
            map.addSource('radius-data', {
                type: 'geojson',
                data: searchRadius
            });
        if (!map.getLayer('radius-layer'))
            map.addLayer({
                id: "radius-layer",
                type: "fill",
                source: "radius-data",
                paint: {
                    "fill-color": "yellow",
                    "fill-opacity": 0.25
                }
            });
    })
    map.on('mouseleave', 'houses-layer', (e) => {
        map.getCanvas().style.cursor = '';
        map.removeLayer('radius-layer');
        map.removeSource('radius-data');
    })
}
// ------------------------


// MAIN -------------------
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: porto,
    zoom: 5, // starting zoom
    maxBounds: bounds
});

map.on('load', () => {
    // load POIs onto map representation
    Object.keys(fileIds).map((key) => {
        loadGeoJson(map, key, fileIds[key], true);
    })

    drawHouses(map);

})
