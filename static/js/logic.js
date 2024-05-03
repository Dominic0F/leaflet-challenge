var mymap = L.map('map').setView([37.8, -96], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(mymap);

function getColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70  ? '#BD0026' :
           depth > 50  ? '#E31A1C' :
           depth > 30  ? '#FC4E2A' :
           depth > 10   ? '#FD8D3C' :
                         '#FEB24C';
}

function style(feature) {
    return {
        fillColor: getColor(feature.geometry.coordinates[2]),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7,
        radius: 3 * feature.properties.mag
    };
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h4>Location: ${feature.properties.place}</h4><p>Date/Time: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
        }
    }).addTo(mymap);
});

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 50, 70, 90],
        labels = [];
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km');
    }
    return div;
};
legend.addTo(mymap);
