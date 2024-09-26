/** CE FICHIER REGROUPE DES FONCTIONS UTILITAIRES , IL FAUT TOUJOURS LE CHARGER AVANT LE MAP.JS * */



/*

CETTE FONCTION COMPTE LE NOMBRE D'ENTITES DANS LA ZONE DE DESSIN

PARAMETRES : GeoPointsDatas (represente le set de points charges depuis le GeoJson)
  drawnItems (represente le groupe de points qui ont été dessinés)
  label (represente le label affiché dans l'alerte , ce que represente ces points)
  TheMap: la carte

*/

function CountEntytiesInZone(GeoPointsDatas, drawnItems, label, TheMap) {
  var pointsInBounds = 0;
  //je Détecte quand un polygone ou un rectangle est dessiné
  TheMap.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);

    // Otenir les limites de la zone dessinée
    var bounds = layer.getBounds();

    //je  Compte combien de points se trouvent dans cette zone
    pointsInBounds = 0;
    GeoPointsDatas.eachLayer(function (pointLayer) {
      if (bounds.contains(pointLayer.getLatLng())) {
        pointsInBounds++;
      }
    });

    alert("Nombre de " + label + " dans cette zone : " + pointsInBounds);
  });

  return pointsInBounds;
}





/** CETTE FONCTION INITIALISE LES OBTIONS DE DESSINS COMME LE CONTROLEUR  ,
 * ELLE PREND LA CARTE EN ARGUMENT ET RETOURNE LE DRAWITEMS
 * QUI EST PRECIEUX POUR LE COMPTEUR D'ELEMENTS * */
function InitDraw(TheMap) {
  // ########### OPTIONS DE DESSIN ############################ //

  // Ajouter le dessin de polygone
  var drawnItems = new L.FeatureGroup();
  TheMap.addLayer(drawnItems);

  var drawControl = new L.Control.Draw({
    position: "bottomleft",
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
  });
  TheMap.addControl(drawControl);
  return drawnItems;
}






/** CEETE FONCTION AJOUTE LE SET DE POINTS GEOJSON A LA CARTE */

function AddPoints(pointsGoJson, TheMap,color='#3388ff',fillColor='#3388ff') {
  // Charger les données GeoJSON des points éducatifs
  var Points = L.geoJSON(pointsGoJson, {
    pointToLayer: function (feature, latlng) {
      // Utiliser des points circulaires (circleMarker) au lieu de markers pour améliorer les performances
      return L.circleMarker(latlng, {
        radius: 5, // Taille du point
        color: color, // Couleur du contour du cercle
        weight: 1, // Épaisseur du contour
        fillColor: fillColor, // Couleur de remplissage
        fillOpacity: 0.7, // Opacité du remplissage
      }).bindPopup(
        " <div class='pop'><p class='title'> Nom : " +
          feature.properties.name +
          "</p> " +
          " <p>OSM ID" +
          feature.properties.osm_id +
          "</p> " +
          " <p>COO: " +
          feature.geometry.coordinates +
          "</p></div> "
      ); // Popup avec le nom de l'école
    },
  }).addTo(TheMap);

  return Points;
}
