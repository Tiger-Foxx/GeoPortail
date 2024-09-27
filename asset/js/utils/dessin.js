/** CE FICHIER REGROUPE DES FONCTIONS UTILITAIRES POUR LE DESSIN , IL FAUT TOUJOURS LE CHARGER AVANT LE MAP.JS * */



/*

CETTE FONCTION COMPTE LE NOMBRE D'ENTITES DANS LA ZONE DE DESSIN

PARAMETRES : GeoPointsDatas (represente le set de points charges depuis le GeoJson)
  drawnItems (represente le groupe de points qui ont été dessinés)
  label (represente le label affiché dans l'alerte , ce que represente ces points)
  TheMap: la carte

*/
/**
 * Cette fonction compte le nombre d'entités dans la zone de dessin et renvoie un objet avec des informations supplémentaires.
 * 
 * @param {L.GeoJSON} GeoPointsDatas - Le set de points GeoJSON chargé sur la carte
 * @param {L.FeatureGroup} drawnItems - Le groupe de points qui ont été dessinés
 * @param {string} label - Le label pour afficher dans l'alerte
 * @param {L.Map} TheMap - La carte Leaflet
 * @returns {Object} - Un objet contenant le nombre de points, la superficie, le périmètre et le type de forme dessinée
 */
function CountEntytiesInZone(GeoPointsDatas, drawnItems, label, TheMap) {
  var result = {
      pointsInBounds: 0,
      area: 0,
      perimeter: 0,
      shapeType: ''
  };
  var big=false;
  // Détecter quand un polygone ou un rectangle est dessiné
  TheMap.on(L.Draw.Event.CREATED, function (event) {
      var layer = event.layer;
      drawnItems.addLayer(layer);

      // Obtenir les limites de la zone dessinée
      var bounds = layer.getBounds();

      // Compter combien de points se trouvent dans cette zone
      result.pointsInBounds = 0;
      GeoPointsDatas.eachLayer(function (pointLayer) {
          if (bounds.contains(pointLayer.getLatLng())) {
              result.pointsInBounds++;
          }
      });

      // Si la forme est un polygone ou rectangle, calculer la superficie et le périmètre
      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          var latlngs = layer.getLatLngs()[0]; // Les coordonnées du polygone ou du rectangle
          result.area = L.GeometryUtil.geodesicArea(latlngs); // Calcul de la superficie
          result.perimeter = L.GeometryUtil.length(latlngs); // Calcul du périmètre
          result.shapeType = layer instanceof L.Rectangle ? 'Rectangle' : 'Polygon';
      } else if (layer instanceof L.Circle) {
          result.area = Math.PI * Math.pow(layer.getRadius(), 2); // Aire du cercle
          result.perimeter = 2 * Math.PI * layer.getRadius(); // Périmètre du cercle
          result.shapeType = 'Circle';
      }

      // Afficher les résultats dans une alerte
      if (result.area>1000000/2) {
        big=true;
        result.area=result.area/1000000;
      }
      unit=!big?'m²\n':'km²\n';
      alert(
          `Nombre de ${label} dans cette zone : ${result.pointsInBounds}\n` +
          `Superficie : ${result.area.toFixed(2)}` + unit +
          `Périmètre : ${result.perimeter.toFixed(2)} m\n` +
          `Type de forme : ${result.shapeType}`
      );
  });

  return result;
}

  
  
  
  
  /** CETTE FONCTION INITIALISE LES OBTIONS DE DESSINS COMME LE CONTROLEUR  ,
   * ELLE PREND LA CARTE EN ARGUMENT ET RETOURNE LE DRAWITEMS
   * QUI EST PRECIEUX POUR LE COMPTEUR D'ELEMENTS * */
  function InitDraw(TheMap,position='bottomleft') {
    // ########### OPTIONS DE DESSIN ############################ //
  
    // Ajouter le dessin de polygone
    var drawnItems = new L.FeatureGroup();
    TheMap.addLayer(drawnItems);
  
    var drawControl = new L.Control.Draw({
      position: position,
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polyline: true,
        marker: true,
        circlemarker: false,
        rectangle: true, // Option de dessin de rectangle
        circle: true, // Désactiver le cercle
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
  