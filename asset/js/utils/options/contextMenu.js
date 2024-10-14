
// Menu contextuel
const contextMenu = document.getElementById('contextMenu');
let currentLayer = null;  // Pour savoir sur quel polygone le menu est ouvert
let currentLatLng=null;

// Fonction pour gérer l'affichage du menu contextuel
function showContextMenu(event) {
   // get co-ordinates
   let { xp, yp } = getCoords(event);

   // convert point x,y to latlng
  const point = L.point(xp, yp);
  const coordinates = map.containerPointToLatLng(point);
  console.log(coordinates);
  currentLatLng=coordinates;
  
  event.preventDefault();
  
  // Afficher le menu contextuel aux coordonnées du clic droit
  const contextMenu = document.getElementById("contextMenu");
  contextMenu.style.display = "block";
  contextMenu.style.left = `${event.pageX}px`;
  contextMenu.style.top = `${event.pageY}px`;
  // currentLatLng = event.latlng;

  // Générer les options du sous-menu
  const submenu = document.getElementById("submenu");
  submenu.innerHTML = ""; // Réinitialiser le sous-menu

  const properties = currentLayer.feature.properties;
  for (let key in properties) {
    if (properties.hasOwnProperty(key)) {
      // Ne pas ajouter les clés indésirables comme "fit", "forme", ou "nom"
      if (key.startsWith("fit") || key === "forme") {
        continue;
      }

      // Créer un élément de sous-menu pour chaque propriété
      const menuItem = document.createElement("div");
      menuItem.className = "submenu-item";
      menuItem.textContent = capitalizeFirstLetter(key);

      // Ajouter un événement clic pour mettre à jour le label
      menuItem.onclick = function () {
        updateFeatureLabel(key);
      };

      submenu.appendChild(menuItem);
    }
  }
}

function updateFeatureLabel(selectedProperty) {
  // Mettre à jour le tooltip (label) du feature avec la propriété sélectionnée
 // console.log('la propriété sélectionnée est : ',selectedProperty)
  const properties = currentLayer.feature.properties;
  //console.log('les propriétés sont : ',properties)
  const text = properties[selectedProperty] || "Aucune donnée";
   const labelText=text.toString()
  // console.log('le label est : ',labelText);

  // Supprimer l'ancien tooltip et en ajouter un nouveau
  if (currentLayer.getTooltip()) {
    currentLayer.unbindTooltip();
  }
  currentLayer
    .bindTooltip(labelText, {
      permanent: true,
      direction: "center",
      className: "label-class",
    })
    .openTooltip();
}


// Masquer le menu contextuel lorsqu'on clique ailleurs
document.addEventListener("click", function (event) {
  const contextMenu = document.getElementById("contextMenu");

  // Masquer le menu contextuel si on clique en dehors
  if (!contextMenu.contains(event.target)) {
    contextMenu.style.display = "none";
  }
});

// Ajouter un événement pour zoomer lorsque l'option est cliquée
document.getElementById('zoomOption').addEventListener('click', function () {
    if (currentLayer) {
        if (
            currentLayer.feature.geometry.type === "LineString" ||
            currentLayer.feature.geometry.type === "Polygon" ||
            currentLayer.feature.geometry.type === "MultiPolygon"
          ) {

            
        var bounds = currentLayer.getBounds();  // Obtient les limites du polygone

        // Calculer le zoom le plus serré
        //var targetZoom = map.getBoundsZoom(bounds, false);

        // Appliquer le zoom serré avec padding minimal
        map.flyToBounds(bounds, { padding: [0, 0] });
        // // Fixer un zoom maximal si nécessaire pour vraiment "serrer"
        // var maxZoom = 100;  // Tu peux ajuster ce niveau selon tes besoins
        // map.setZoom(targetZoom > maxZoom ? maxZoom : targetZoom);
            
        }else{
           // currentLayer.dblclick();
           console.table(currentLayer)
            map.setView(currentLayer.feature.geometry.coordinates.reverse(), 14);
        }



        contextMenu.style.display = 'none';  // Masquer le menu après avoir zoomé
    }
});


function toggleLabel(layer) {
    if (layer.getTooltip()) {
      // Si le label est déjà affiché, le masquer
      layer.unbindTooltip();
    } else {
      // Si le label n'est pas encore affiché, le montrer avec la propriété 'nom'
      const labelText = layer.feature.properties.nom || layer.feature.properties.departement || layer.feature.properties.divison || layer.feature.properties. commune || 'Sans nom';
      console.table(layer)
      layer.bindTooltip(labelText, { permanent: true, direction: "center", className: "label-class" }).openTooltip();
    }
  }
  

// // Ajouter un événement pour zoomer lorsque l'option est cliquée
// document.getElementById('labelOption').addEventListener('click', function () {
//     if (currentLayer) {
//         toggleLabel(currentLayer);
//     }
// });

document.getElementById('AllLabel').addEventListener('click', function () {
    if (currentLayer) {

      layerBoundsGroup.eachLayer(function (layer) {
        toggleLabelsForLayer(layer);
    });
        toggleLabelsForLayer(analVolaille.layer);

    }
});



/**
 * Affiche ou retire les labels des entités d'une layer donnée si elles sont des polygones ou des lignes.
 * @param {L.Layer} layer - La layer contenant les entités géographiques (features).
 */
function toggleLabelsForLayer(layer) {
    if (layer !=null) {
        // Vérifier si la première feature est un polygone, multipolygone, ou une ligne
        const firstFeature = layer.toGeoJSON().features[0];
        // console.log('hello')
        if (firstFeature) {
            console.log('hello')
          const geometryType = firstFeature.geometry.type;
          
          // Vérifier si la géométrie est de type Polygon, MultiPolygon, LineString, ou MultiLineString
          if (
            geometryType === "Polygon" ||
            geometryType === "MultiPolygon" ||
            geometryType === "LineString" ||
            geometryType === "MultiLineString"
          ) {
            
            // Parcourir chaque entité (feature) dans la layer
            layer.eachLayer(function (featureLayer) {
              if (featureLayer.feature) {
                // Vérifier si un label est déjà affiché
                if (featureLayer.getTooltip()) {
                  // Si le label est affiché, le masquer
                  featureLayer.unbindTooltip();
                } else {
                  // Sinon, afficher le label avec la propriété 'nom' ou d'autres alternatives
                  const labelText =
                    featureLayer.feature.properties.nom ||
                    featureLayer.feature.properties.departement ||
                    featureLayer.feature.properties.division ||
                    featureLayer.feature.properties.commune ||
                    "Sans nom";
      
                  featureLayer.bindTooltip(labelText, {
                    permanent: true,
                    direction: "center", // ou 'top' selon ton besoin
                    className: "label-class",
                  }).openTooltip();
                }
              }
            });
          } else {
            console.log("Cette couche ne contient ni polygones, ni lignes.");
          }
        } else {
          console.log("Aucune feature disponible dans cette layer.");
        }
    }
  }




  // Fonction pour insérer un marqueur à l'endroit cliqué
function insertMarker(latlng) {
  if (latlng) {
    // Créer un nouveau marqueur à l'endroit cliqué
    const marker = L.marker(latlng).addTo(map);
    marker.bindPopup("Nouveau marqueur ajouté ici !").openPopup();
    
    console.log("Marqueur ajouté à : ", latlng);
  } else {
    console.error("Impossible d'ajouter un marqueur. Coordonnées non définies.");
  }

  // Cacher le menu contextuel après avoir ajouté le marqueur
  hideContextMenu();
}

// Cacher le menu contextuel
function hideContextMenu() {
  const contextMenu = document.getElementById("contextMenu");
  contextMenu.style.display = "none";
}
  


document.getElementById('insertMarker').addEventListener('click', function () {
      console.log('coordonnees actuelles : ',currentLatLng)

      insertMarker(currentLatLng)


});

