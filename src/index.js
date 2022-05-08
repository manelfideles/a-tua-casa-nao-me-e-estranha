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
    'subway-stops': 'black',
    'supermarkets': 'black',
    'tram-stops': 'gold',
}

// Search radius options
var radius = 0.25;
const options = {
    steps: 45,
    units: "kilometers",
};

mapboxgl.accessToken = 'pk.eyJ1IjoiZmlkZWxlcyIsImEiOiJjbDJoYzJoeGQwNjdvM25vN29tY2k5Y2tsIn0.JuCva4gmqFcpFPI7zQRQ1g';

// ------------------------

// FUNCTIONS --------------
function loadGeoJson(map, poi_id, color, draw) {
    map.addSource(poi_id, {
        type: 'geojson',
        data: `http://127.0.0.1:5500/datasets/${poi_id}.geojson`
    })
    if (draw) {
        map.addLayer({
            'id': `${poi_id}-layer`,
            'type': 'circle',
            'source': poi_id,
            'layout': {
                'visibility': 'visible'
            },
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
        closeOnClick: false
    });
    map.on('click', 'houses-layer', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        popup.setLngLat(coordinates).setHTML(coordinates).addTo(map);

        map.getCanvas().style.cursor = 'pointer';
        const center = e.features[0].geometry.coordinates.slice();
        const searchRadius = turf.circle(center, radius, options);
        if (!map.getSource('radius-data'))
            map.addSource('radius-data', {
                type: 'geojson',
                data: searchRadius
            });
        if (!map.getLayer('radius-layer')) {
            console.log('added layer');
            map.addLayer({
                id: "radius-layer",
                type: "line",
                source: "radius-data",
                paint: {
                    "line-color": "yellow",
                    /* "fill-opacity": 0.25 */
                }
            });
            map.addLayer({
                id: "radius-layer-2",
                type: "fill",
                source: "radius-data",
                paint: {
                    "fill-color": "yellow",
                    "fill-opacity": 0.10
                }
            });
        }

        else {
            if (map.getLayer('radius-layer')) {
                console.log('removed layer');
                map.removeLayer('radius-layer');
                map.removeLayer('radius-layer-2');
            }
            if (map.getSource('radius-data')) {
                map.removeSource('radius-data');
                popup.remove();
                map.getCanvas().style.cursor = '';
            }
        }

        // lookup das coordenadas no dataset que tem a info para o popup
        // display
    })
}

function togglePOIsLayer() {
    // Enumerate ids of the layers.
    const toggleableLayerIds = Object.keys(fileIds);

    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
        const layerid = `${id}-layer`;

        // Skip layers that already have a button set up.
        if (document.getElementById(layerid)) {
            continue;
        }

        // Create a link.
        const link = document.getElementById('item');
        link.id = layerid;
        // link.href = '#';
        // link.textContent = layerid;
        link.className = 'active';

        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            const clickedLayer = layerid;
            e.preventDefault();
            e.stopPropagation();

            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
            );

            // Toggle layer visibility by changing the layout object's visibility property.
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(
                    clickedLayer,
                    'visibility',
                    'visible'
                );
            }
        };

        const layers = document.getElementById('menu');
        layers.appendChild(link);
    }
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

window.addEventListener('load', () => {
    const legendItems = document.getElementsByClassName('item');
    for (let i = 0; i < legendItems.length; i++) {
        const item = legendItems[i];
        item.addEventListener('click', (e) => {
            console.log('buceta');
            console.log(e.children[1].innerHTML.replace(' ', '-').toLowerCase());
            // console.log(`Clicked ${e.target.children[1].innerHTML.replace(' ', '-').toLowerCase()} layer`);
        })
    }
});

map.on('load', () => {
    // load POIs onto map representation
    Object.keys(fileIds).map((key) => {
        loadGeoJson(map, key, fileIds[key], true);
    })

    // @TODO - atualizar o radius on click nos botoes do painel:
    // experimentar remover bloco do radius
    // daqui
    drawHouses(map);

    // e metê-lo aqui
    // btns on click {
    //     map.on(bloco do radius)
    // }

    // togglePOIsLayer();

})
