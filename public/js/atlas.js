import Request from 'request';

L.mapbox.accessToken = 'pk.eyJ1IjoiY3J1Y2lmaXhhcm5hdWQiLCJhIjoiY2lxejJocHB6MDA1dWkybWc1MnhyMWRoOCJ9.BcDRx2fZ0sl3q5ofSTbZ_g';

const artistsGeojsonUrl = 'http://localhost:8080/artists/geojson';

var artistsPromise = new Promise(function(resolve, reject) {
  // setTimeout(() => resolve(4), 2000);
  Request(artistsGeojsonUrl, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // Success
      resolve(JSON.parse(body));
    } else {
      console.error(error);
    }
  });
});

artistsPromise.then((res) => {
  createAtlas(res);
});

function createAtlas(geojson) {

  var map = L.mapbox.map('map')
    .setView([36.3843749, -98.7628543], 5)
    .addLayer(L.mapbox.tileLayer('mapbox.dark'));

  L.mapbox.featureLayer().loadURL('/artists/geojson').on('ready', function(e) {
    // The clusterGroup gets each marker in the group added to it
    // once loaded, and then is added to the map
    var clusterGroup = new L.MarkerClusterGroup();
    e.target.eachLayer(function(layer) {

      var marker = layer,
        feature = marker.feature;

      var popupContent =  '<div id="' + feature.properties.id + '" class="popup">' +
        '<h2 class="popup__title artist__name">' + feature.properties.name + '</h2>' +
        '<div class="popup__thumbnail">' +
          '<img src="' + feature.properties.icon.iconUrl + '" class="image" alt="">' +
        '<div>' +
        '<div class="popup__body">' +
          '<div class="artist__location">' +
            '<p class="artist__location__city">' + feature.properties.location.city +'</p>' +
            (feature.properties.location.neighborhood !== null ? '<p class="artist__location__neighborhood">, ' + feature.properties.location.neighborhood +'</p>' : '') +
          '</div>' +
          (feature.properties.bio.wikipediaUrl !== '' || feature.properties.bio.birthdate !== null || feature.properties.bio.deathdate !== null ?
          '<div class="artist__bio">' +
            '<h2 class="popup__body__title">Bio: </h2>' +
            (feature.properties.bio.wikipediaUrl !== '' ?
            '<a class="artist__bio__wikipedia" href="' + feature.properties.bio.wikipediaUrl +'" title="Open the youtube page of ' + feature.properties.name + '">Wikipedia Page</a>' : '') +
            (feature.properties.bio.birthdate !== null ? '<p class="artist__bio__birthdate">Birthdate: ' + moment(feature.properties.bio.birthdate).format("MM/DD/YYYY") +'</p>' : '') +
            (feature.properties.bio.deathdate !== null ? '<p class="artist__bio__deathdate">Deathdate: ' + moment(feature.properties.bio.deathdate).format("MM/DD/YYYY") +'</p>' : '') +
          '</div>' : '') +
          (feature.properties.youtube.clipExampleUrl !== '' || feature.properties.youtube.pageUrl !== undefined ?
          '<div class="artist__youtube">' +
            (feature.properties.youtube.clipExampleUrl !== '' ?
            '<iframe width="300" height="169" src="' + feature.properties.youtube.clipExampleUrl + '" frameborder="0" allowfullscreen></iframe>' : '') +
            (feature.properties.youtube.pageUrl !== '' ?
            '<a class="artist__youtube__page-url" href="' + feature.properties.youtube.pageUrl +'" title="Open the youtube page of ' + feature.properties.name + '">Youtube Page</a>' : '') +
          '</div>' : '' ) +
        '</div>' +
      '</div>';

      marker.bindPopup(popupContent);

      marker.setIcon(L.icon(feature.properties.icon));

      var content = '<h2>'+ feature.properties.name+'<\/h2>' + '<img src="'+feature.properties.icon.iconUrl+'" alt="">';

      clusterGroup.addLayer(layer);
    });
    map.addLayer(clusterGroup);
  });
}