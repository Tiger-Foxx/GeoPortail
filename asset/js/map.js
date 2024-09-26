// ################# INITIALISATION DES CONSTANTES ################################# //

const params = {
  lat: 7.365302,
  lng: 12.343439,
};
const zoomlevel = 10;

const map = L.map("map-div").setView([params.lat, params.lng], zoomlevel);

const EDUCATIONAL_POINTS = PointsEducatifs;

// ################# INITIALISATION DES CONSTANTES ################################# //


function init() {
  const mainLayer = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );

  mainLayer.addTo(map);
}



function AddPoints(pointsGoJson) {
  // Charger les données GeoJSON des points éducatifs
  var educationalPoints = L.geoJSON(pointsGoJson, {
    pointToLayer: function (feature, latlng) {
        // Utiliser des points circulaires (circleMarker) au lieu de markers pour améliorer les performances
        return L.circleMarker(latlng, {
          radius: 5,  // Taille du point
          color: '#3388ff',  // Couleur du contour du cercle
          weight: 1,  // Épaisseur du contour
          fillColor: '#3388ff',  // Couleur de remplissage
          fillOpacity: 0.7,  // Opacité du remplissage
        }).bindPopup(" <div class='pop'><p class='title'> Nom : "+feature.properties.name+"</p> "+" <p>OSM ID"+feature.properties.osm_id+"</p> " +" <p>COO: "+feature.geometry.coordinates+"</p></div> ");  // Popup avec le nom de l'école
      },
  }).addTo(map);

  // Charger le fichier GeoJSON
//   fetch(pointsGoJson)
//     .then((response) => response.json())
//     .then((data) => {
//       educationalPoints.addData(data);
//     });


// ########### OPTIONS DE DESSIN ############################ //

  // Ajouter le dessin de polygone
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  var drawControl = new L.Control.Draw({
    position: 'bottomleft',
    edit: {
      featureGroup: drawnItems,
    },
    draw: {
      polyline: false,
      marker: false,
      circlemarker: false,
      rectangle: true, // Option de dessin de rectangle
      circle: false, // Désactiver le cercle
    },
  })
  map.addControl(drawControl);

    // Détecter quand un polygone ou un rectangle est dessiné
    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);
    
        // Obtenir les limites de la zone dessinée
        var bounds = layer.getBounds();
    
        // Compter combien de points se trouvent dans cette zone
        var pointsInBounds = 0;
        educationalPoints.eachLayer(function (pointLayer) {
          if (bounds.contains(pointLayer.getLatLng())) {
            pointsInBounds++;
          }
        });
    
        // Afficher une alerte avec le nombre de points éducatifs dans la zone
        alert("Nombre de points éducatifs dans cette zone : " + pointsInBounds);
      });
    


}


init();
AddPoints(EDUCATIONAL_POINTS);
