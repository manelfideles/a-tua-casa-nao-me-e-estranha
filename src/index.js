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
async function loadGeoJson(map, poi_id, color, returnVal) {

    // return house array
    if (returnVal) {
        const res = await fetch('../datasets/houses.geojson');
        return res.json();
    }

    else {
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
}

function drawSearchRadius(index, map, center, options) {

    console.log('Center point of', index, ': ', center);
    const searchRadius = turf.circle(center, radius, options);

    map.addSource(`circleData-${index}`, {
        type: 'geojson',
        data: searchRadius
    });
}

async function drawHouses(map) {
    const houses = await loadGeoJson(map, 'houses', 'white', true);
    const houseArray = houses.features;
    for (let i = 0; i < houseArray.length; i++) {
        const house = houseArray[i];

        console.log(radius);
        drawSearchRadius(
            i,
            map,
            house.geometry.coordinates,
            options
        )

        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
            `Olá, eu sou a casa número ${i}`
        );

        var elem = document.createElement('div');
        elem.innerHTML = 'MARKER';
        elem.class = 'marker';

        const marker = new mapboxgl.Marker()
            .setLngLat(house.geometry.coordinates)
            // .setPopup(popup)
            .addTo(map);

        marker.getElement().addEventListener('mouseenter', () => {
            console.log(house.geometry.coordinates);
            map.addLayer({
                'id': `circle-${i}`,
                'type': 'fill',
                'source': `circleData-${i}`,
                'paint': {
                    'fill-color': 'yellow',
                    'fill-opacity': 0.25,
                }
            });
        })
        marker.getElement().addEventListener('mouseleave', () => {
            console.log(house.geometry.coordinates);
            if (map.getLayer(`circle-${i}`)) {
                map.removeLayer(`circle-${i}`);
            }
        })
    }
}

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
        loadGeoJson(map, key, fileIds[key], false);
    })

    loadGeoJson(map, 'houses', 'white')
    drawHouses(map);

})

const rangeBtns = document.querySelectorAll('.range-value');
let activeBtn = null;
rangeBtns.forEach((btn) => {
    btn.addEventListener('click', (ev) => {
        ev.target.style.backgroundColor = 'lightgrey';
        radius = parseFloat(ev.target.innerHTML);
        console.log(parseFloat(radius));
        if (activeBtn == null && activeBtn != ev.currentTarget) {
            ev.target.style.backgroundColor = null;
        }
        activeBtn = ev.currentTarget;
        /* for (let i = 0; i < 10; i++) {
            const element = array[i];
            
        } */
    })
});
