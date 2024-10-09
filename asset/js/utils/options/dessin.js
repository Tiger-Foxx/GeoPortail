/** CE FICHIER REGROUPE DES FONCTIONS UTILITAIRES POUR LE DESSIN , IL FAUT TOUJOURS LE CHARGER AVANT LE MAP.JS * */



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
      layer.on('click', function () {
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
      layer.on('click', function () {
          layer.bindPopup(popupContent).openPopup();
      });

      // Fermer le popup lors du mouseout
      layer.on('mouseout', function () {
          layer.closePopup();
      });
  });
}
