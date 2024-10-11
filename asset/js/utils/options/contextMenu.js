
// Menu contextuel
const contextMenu = document.getElementById('contextMenu');
let currentLayer = null;  // Pour savoir sur quel polygone le menu est ouvert

// Fonction pour gérer l'affichage du menu contextuel
function showContextMenu(event) {
    event.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
}

// Masquer le menu contextuel lorsqu'on clique ailleurs
document.addEventListener('click', function () {
    contextMenu.style.display = 'none';
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
  

// Ajouter un événement pour zoomer lorsque l'option est cliquée
document.getElementById('labelOption').addEventListener('click', function () {
    if (currentLayer) {
        toggleLabel(currentLayer);
    }
});




