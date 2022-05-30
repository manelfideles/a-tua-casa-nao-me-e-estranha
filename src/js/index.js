import {
    porto, bounds,
    fileIds, /* radius ,*/
} from './config.js';

import {
    loadGeoJson,
    drawHouses,
    addRangeListeners,
} from './utils.js';


mapboxgl.accessToken = 'pk.eyJ1IjoiZmlkZWxlcyIsImEiOiJjbDJoYzJoeGQwNjdvM25vN29tY2k5Y2tsIn0.JuCva4gmqFcpFPI7zQRQ1g';

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
            console.log(`Clicked ${e.target.children[1].innerHTML.replace(' ', '-').toLowerCase()} layer`);
        })
    }
});

map.on('load', async () => {
    // load POIs onto map representation
    Object.keys(fileIds).map((key) => {
        loadGeoJson(map, key, fileIds[key], true);
    })

    // @TODO - atualizar o radius on click nos botoes do painel:
    // experimentar remover bloco do radius
    // daqui
    drawHouses(map, 0.25);
    addRangeListeners('range-value', map);

    // togglePOIsLayer();

})
