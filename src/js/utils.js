import {
    scores, getAverage
} from './config.js';


// load POIs into map
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

// draw radius around house
function drawSearchRadius(map, center, options, radius, popup) {

    console.log(center);

    console.log('drawSearchRadius radius:', radius);

    const searchRadius = turf.circle(center, radius, options);

    // Add source+layer of radius
    if (!map.getSource(`${center}-source`)) {
        map.addSource(`${center}-source`, {
            type: 'geojson',
            data: searchRadius
        });
        map.addLayer({
            id: `${center}-layer`,
            type: "line",
            source: `${center}-source`,
            paint: {
                "line-color": "yellow",
            }
        });
        map.addLayer({
            id: `${center}-layer-2`,
            type: "fill",
            source: `${center}-source`,
            paint: {
                "fill-color": "yellow",
                "fill-opacity": 0.10
            }
        });

        console.log(`Added ${center}-source`);
        console.log(`Added ${center}-layer`);
    }

    // Remove source+layer of radius
    else {
        map.removeLayer(`${center}-layer`);
        map.removeLayer(`${center}-layer-2`);
        map.removeSource(`${center}-source`);
        popup.remove();
        map.getCanvas().style.cursor = '';

        console.log(`Removed ${center}-layer`);
        console.log(`Removed ${center}-source`);
    }
}

// draw houses and respective popups
function drawHouses(map, radius) {
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

    console.log('drawHouses radius:', radius);

    map.on('click', 'houses-layer', (e) => houseClickHandler(e, map, radius, popup))
}

function houseClickHandler(e, map, radius, popup) {
    const center = e.features[0].geometry.coordinates.slice();
    center[0] = center[0].toFixed(4);
    center[1] = center[1].toFixed(4);
    popup
        .setLngLat(center)
        .setHTML(
            `<div class='popup'>
                <div class='left'>
                    <p>Accessibility Score</p>
                    <p>${getAverage(scores[center])}/100</p>
                </div>
                <div class='right'>
                    <div class='keys'>
                        <span>Parks</span>
                        <span>Gyms</span>
                        <span>Malls</span>
                        <span>Schools</span>
                    </div>
                    <div class='values'>
                        <span class='value'>${scores[center][0]}/100</span>
                        <span class='value'>${scores[center][1]}/100</span>
                        <span class='value'>${scores[center][2]}/100</span>
                        <span class='value'>${scores[center][3]}/100</span>
                    </div>
                </div>
            </div>`
        )
        .addTo(map);
    map.getCanvas().style.cursor = 'pointer';

    // drawSearchRadius(map, center, options, radius, popup);
    // lookup das coordenadas no dataset que tem a info para o popup
    // display

}

// show and hide POIs layers
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

function addRangeListeners(classname, map) {
    const radiusControllers = document.getElementsByClassName(classname);
    for (let i = 0; i < radiusControllers.length; i++) {
        const val = radiusControllers[i];
        val.addEventListener('click', (ev) => radiusListener(ev, map))
    }
}

// set radius and draw on map
async function radiusListener(ev, map) {
    const btn = ev.target;
    const selectedRadius = btn.innerHTML;
    const rangeBtns = document.getElementsByClassName('range-value');

    console.log('radiusListener radius:', selectedRadius);

    // style change
    btn.style.backgroundColor = 'lightgrey';
    for (let i = 0; i < rangeBtns.length; i++) {
        const rangeBtn = rangeBtns[i];
        if (rangeBtn.innerHTML !== selectedRadius)
            rangeBtn.style.backgroundColor = '#EFEFEF';
    }

    // still have to pass radius to get
    // corresponding info
}

export {
    loadGeoJson,
    drawHouses,
    togglePOIsLayer,
    addRangeListeners,
    radiusListener
}