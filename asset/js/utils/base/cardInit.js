/**  CE FICHIER REGROUPE TOUTES LES FONCTIONS EN LIEN AVEC L'INITIALISATION DE LA CARTE */


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
            radius: 5,         // Taille du point
            color: color,      // Couleur du contour du cercle
            fillColor: fillColor, // Couleur de remplissage
            weight: 1,         // Épaisseur du contour
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
  
  