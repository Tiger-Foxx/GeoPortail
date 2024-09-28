/** CE FICHIER REGROUPE DES FONCTIONS UTILITAIRES POUR LE DESSIN , IL FAUT TOUJOURS LE CHARGER AVANT LE MAP.JS * */


  
  
  
 
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

   // modifier le container du control.
  var htmlObject = drawControl.getContainer();
  var container = document.getElementById('dessin');
  
  function setParent(el, newParent)
  {
    newParent.appendChild(el);
  }
  setParent(htmlObject, container);
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
        fillColor: fillColor, // Couleur de remplissage

        weight: 1, // Épaisseur du contour
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
  });

  return Points;
}


/** CE FICHIER REGROUPE DES FONCTIONS UTILITAIRES POUR LE DESSIN , IL FAUT TOUJOURS LE CHARGER AVANT LE MAP.JS * */

/**
 * Cette fonction compte le nombre d'entités dans la zone de dessin et renvoie un objet avec des informations supplémentaires.
 * Elle attache également des événements pour afficher un popup sur le survol de la zone dessinée.
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
  var big = false;

  TheMap.on(L.Draw.Event.CREATED, function (event) {
      var layer = event.layer;
      drawnItems.addLayer(layer);

      var bounds = layer.getBounds();
      result.pointsInBounds = 0;
      
      GeoPointsDatas.eachLayer(function (pointLayer) {
          if (bounds.contains(pointLayer.getLatLng())) {
              result.pointsInBounds++;
          }
      });

      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          var latlngs = layer.getLatLngs()[0];
          result.area = L.GeometryUtil.geodesicArea(latlngs);
          result.perimeter = L.GeometryUtil.length(latlngs);
          result.shapeType = layer instanceof L.Rectangle ? 'Rectangle' : 'Polygon';
      } else if (layer instanceof L.Circle) {
          result.area = Math.PI * Math.pow(layer.getRadius(), 2);
          result.perimeter = 2 * Math.PI * layer.getRadius();
          result.shapeType = 'Circle';
      }

      if (result.area > 1000000 / 2) {
          big = true;
          result.area = result.area / 1000000;
      }
      var unit = !big ? 'm²' : 'km²';

      // Créer un popup sur le survol de la forme
      layer.on('mouseover', function () {
          var popupContent = `
              <strong>${label} dans cette zone :</strong><br>
              Nombre de ${label} : ${result.pointsInBounds}<br>
              Superficie : ${result.area.toFixed(2)} ${unit}<br>
              Périmètre : ${result.perimeter.toFixed(2)} m<br>
              Type de forme : ${result.shapeType}
          `;
          layer.bindPopup(popupContent).openPopup();
      });

      // Supprimer le popup lorsqu'on quitte la forme
      layer.on('mouseout', function () {
          layer.closePopup();
      });
  });

  return result;
}


/**
 * Cette fonction compte le nombre d'entités dans la zone de dessin et renvoie un objet avec des informations supplémentaires.
 * Elle attache également des événements pour afficher un popup sur le survol de la zone dessinée.
 * 
 * @param {Array<L.GeoJSON>} GeoPointsDatasList - La liste de sets de données GeoJSON (points ou lignes) chargés sur la carte
 * @param {L.FeatureGroup} drawnItems - Le groupe de formes qui ont été dessinées
 * @param {Array<string>} labels - La liste des labels pour chaque ensemble de données GeoJSON
 * @param {L.Map} TheMap - La carte Leaflet
 */
function NewCountEntytiesInZone(GeoPointsDatasList, drawnItems, labels, TheMap) {
  // Avant de réattacher l'événement, supprimer l'ancien écouteur s'il existe
  TheMap.off(L.Draw.Event.CREATED);

  var results = [];
  var big = false;

  TheMap.on(L.Draw.Event.CREATED, function (event) {
      var layer = event.layer;
      drawnItems.addLayer(layer);

      var bounds = layer.getBounds();
      var totalPoints = 0;
      var totalLines = 0;
      var area = 0;
      var perimeter = 0;
      var shapeType = '';

      // Parcourir chaque ensemble de données GeoJSON
      GeoPointsDatasList.forEach(function (GeoPointsDatas, index) {
          var pointsInBounds = 0;
          var linesInBounds = 0;
          var isLine = false;
          var label = labels[index];

          GeoPointsDatas.eachLayer(function (layer) {
              if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
                  // C'est un point
                  if (bounds.contains(layer.getLatLng())) {
                      pointsInBounds++;
                  }
              } else if (layer instanceof L.Polyline) {
                  // C'est une ligne
                  var lineBounds = layer.getBounds();
                  if (bounds.intersects(lineBounds)) {
                      linesInBounds++;
                      isLine = true;
                  }
              }
          });

          // Calculer la superficie et le périmètre pour les polygones ou rectangles
          if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
              var latlngs = layer.getLatLngs()[0];
              area = L.GeometryUtil.geodesicArea(latlngs);
              perimeter = L.GeometryUtil.length(latlngs);
              shapeType = layer instanceof L.Rectangle ? 'Rectangle' : 'Polygon';
          } else if (layer instanceof L.Circle) {
              area = Math.PI * Math.pow(layer.getRadius(), 2);
              perimeter = 2 * Math.PI * layer.getRadius();
              shapeType = 'Circle';
          }

          // Ajouter les résultats au total
          totalPoints += pointsInBounds;
          totalLines += linesInBounds;

          // Sauvegarder les résultats pour cet ensemble de données
          results.push({
              label: label,
              pointsInBounds: pointsInBounds,
              linesInBounds: linesInBounds,
              isLine: isLine
          });
      });

      // Adapter les unités pour la superficie
      if (area > 1000000 / 2) {
          big = true;
          area = area / 1000000;
      }
      var unit = !big ? 'm²' : 'km²';

      // Créer le contenu du popup
      var popupContent = '';
      results.forEach(function (result) {
          if (result.isLine) {
              popupContent += `<strong>${result.label} dans cette zone :</strong> ${result.linesInBounds} lignes trouvées.<br>`;
          } else {
              popupContent += `<strong>${result.label} dans cette zone :</strong> ${result.pointsInBounds} points trouvés.<br>`;
          }
      });

      popupContent += `Superficie : ${area.toFixed(2)} ${unit}<br>`;
      popupContent += `Périmètre : ${perimeter.toFixed(2)} m<br>`;
      popupContent += `Type de forme : ${shapeType}`;

      // Afficher le popup sur le survol de la forme dessinée
      layer.on('mouseover', function () {
          layer.bindPopup(popupContent).openPopup();
      });

      // Fermer le popup lors du mouseout
      layer.on('mouseout', function () {
          layer.closePopup();
      });
  });
}

