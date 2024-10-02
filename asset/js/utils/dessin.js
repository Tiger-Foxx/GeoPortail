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

function AddPointsOld(pointsGoJson, TheMap,color='#3388ff',fillColor='#3388ff') {
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


function AddPoints(pointsGoJson, TheMap, color = '#3388ff', fillColor = '#3388ff') {
  // Charger les données GeoJSON des points, lignes et polygones
  var Points = L.geoJSON(pointsGoJson, {
    style: function (feature) {
      // Appliquer un style seulement aux lignes (LineString) et polygones (Polygon, MultiPolygon)
      if (feature.geometry.type === 'LineString') {
        return {
          color: color,  // Couleur de la ligne
          weight: 4,     // Épaisseur de la ligne
          opacity: 0.8,  // Opacité de la ligne
        };
      }
      // Style pour les polygones
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        return {
          color: color,      // Couleur du contour
          weight: 2,         // Épaisseur du contour
          fillColor: fillColor, // Couleur de remplissage
          fillOpacity: 0.4,  // Opacité du remplissage
        };
      }
    },
    pointToLayer: function (feature, latlng) {
      // Si c'est un point, utiliser un circleMarker
      if (feature.geometry.type === 'Point') {
        return L.circleMarker(latlng, {
          radius: 10,         // Taille du point
          color: color,      // Couleur du contour du cercle
          fillColor: fillColor, // Couleur de remplissage
          weight: 3,         // Épaisseur du contour
          fillOpacity: 0.7,  // Opacité du remplissage
        }).bindPopup(
          " <div class='pop'><p class='title'> Nom : " +
            feature.properties.name +
            "</p> " +
            " <p>OSM ID: " +
            feature.properties.osm_id +
            "</p> " +
            " <p>COO: " +
            feature.geometry.coordinates +
            "</p></div> "
        );
      }
    },
    onEachFeature: function (feature, layer) {
      // Gérer les événements pour chaque entité
      if (feature.geometry.type === 'LineString') {
        // Ajouter un popup pour les lignes
        layer.bindPopup(
          " <div class='pop'><p class='title'> Nom : " +
            (feature.properties.name || 'Nom inconnu') +
            "</p> " +
            " <p>OSM ID: " +
            feature.properties.osm_id +
            "</p></div> "
        );

        // Afficher le popup lors du survol de la ligne
        layer.on('mouseover', function (e) {
          this.openPopup();
        });

        // Fermer le popup lorsque la souris quitte la ligne
        layer.on('mouseout', function (e) {
          this.closePopup();
        });
      }

      // Ajouter un popup pour les polygones
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        layer.bindPopup(
          " <div class='pop'><p class='title'> Nom : " +
            (feature.properties.name || 'Nom inconnu') +
            "</p> " +
            " <p>OSM ID: " +
            feature.properties.osm_id +
            "</p></div> "
        );

        // Survol du polygone
        layer.on('mouseover', function (e) {
          this.openPopup();
        });

        // Quitter le polygone
        layer.on('mouseout', function (e) {
          this.closePopup();
        });
      }
    }
  });

  // Ajouter les points, lignes et polygones sur la carte
 // Points.addTo(TheMap);

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
 * @param {Array<L.GeoJSON>} GeoPointsDatasList - La liste de sets de données GeoJSON (points uniquement) chargés sur la carte
 * @param {L.FeatureGroup} drawnItems - Le groupe de formes qui ont été dessinées
 * @param {Array<string>} labels - La liste des labels pour chaque ensemble de données GeoJSON
 * @param {L.Map} TheMap - La carte Leaflet
 */
function NewCountEntytiesInZone(GeoPointsDatasList, drawnItems, labels, TheMap) {
  // Avant de réattacher l'événement, supprimer l'ancien écouteur s'il existe
  TheMap.off(L.Draw.Event.CREATED);

  TheMap.on(L.Draw.Event.CREATED, function (event) {
      var layer = event.layer;
      drawnItems.addLayer(layer);

      var bounds = layer.getBounds();
      var area = 0;
      var perimeter = 0;
      var shapeType = '';
      var big = false;
      var pointsFound = false;  // Pour suivre si au moins un point est trouvé

      var popupContent = '';

      // Parcourir chaque ensemble de données GeoJSON et compter les points dans les limites
      GeoPointsDatasList.forEach(function (GeoPointsDatas, index) {
          var pointsInBounds = 0;
          var label = labels[index];
          
          // Compter seulement les points, pas les lignes (filtrage avec label)
          if (!label.includes('line')) {
              GeoPointsDatas.eachLayer(function (pointLayer) {
                  if (true) {
                      // C'est un point
                      if (bounds.contains(pointLayer.getLatLng())) {
                          pointsInBounds++;
                      }
                  }
              });
          }

          // Ajouter le résultat pour ce label spécifique dans le popup
          if (pointsInBounds > 0) {
            popupContent += `<strong>${label} :</strong> ${pointsInBounds} points trouvés.<br>`;

          }

          // Si on a trouvé des points, on change le flag
          if (pointsInBounds > 0) {
              pointsFound = true;
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

      // Adapter les unités pour la superficie
      if (area > 1000000 / 2) {
          big = true;
          area = area / 1000000;
      }
      var unit = !big ? 'm²' : 'km²';

      // Ajouter la superficie et le périmètre, même si aucun point n'est trouvé
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
