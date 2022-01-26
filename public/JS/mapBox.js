
// const loc = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(loc)
console.log(mapboxgl);

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVlcHIxOSIsImEiOiJja3l2OXg5c3UwNTB0MnBvMHl5a241Ynp6In0.4hrnDs5ZSMvC4y5DmZBiDg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/deepr19/ckyvaoxjx002r14pd4b6dkr0r',
    // center,
    // zoom,
    // interactive
});

