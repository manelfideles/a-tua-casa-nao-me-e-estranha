const porto = [
    -8.611946928173666,
    41.15798495442439
] // starting position [lng, lat]

const bounds = [
    [-8.666783554528266, 41.133935744323],
    [-8.555236943455546, 41.18437884529454]
]

mapboxgl.accessToken = 'pk.eyJ1IjoiZmlkZWxlcyIsImEiOiJjbDJoYzJoeGQwNjdvM25vN29tY2k5Y2tsIn0.JuCva4gmqFcpFPI7zQRQ1g';

function loadPOIs(map, poi_id, color) {
    map.addSource(poi_id, {
        type: 'geojson',
        data: `http://127.0.0.1:5500/a-tua-casa-nao-me-e-estranha/datasets/${poi_id}.geojson`
    })

    map.addLayer({
        'id': `${poi_id}-layer`,
        'type': 'circle',
        'source': poi_id,
        'paint': {
            'circle-radius': 5,
            'circle-color': color,
        }
    });
}

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: porto,
    zoom: 5, // starting zoom
    maxBounds: bounds
});

map.on('load', () => {
    fileIds = {
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
        'supermarkets': 'peach',
        'tram-stops': 'gold',
    }

    Object.keys(fileIds).map((key) => {
        loadPOIs(map, key, fileIds[key]);
    })
})
