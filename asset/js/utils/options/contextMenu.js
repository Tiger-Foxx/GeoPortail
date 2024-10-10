
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
        var bounds = currentLayer.getBounds();  // Obtient les limites du polygone

        // Calculer le zoom le plus serré
        //var targetZoom = map.getBoundsZoom(bounds, false);

        // Appliquer le zoom serré avec padding minimal
        map.fitBounds(bounds, { padding: [0, 0] });

        // // Fixer un zoom maximal si nécessaire pour vraiment "serrer"
        // var maxZoom = 100;  // Tu peux ajuster ce niveau selon tes besoins
        // map.setZoom(targetZoom > maxZoom ? maxZoom : targetZoom);

        contextMenu.style.display = 'none';  // Masquer le menu après avoir zoomé
    }
});




// Fonction onEachFeature pour traiter chaque polygone ou multipolygone
function onEachFeature(feature, layer) {
    // Associer un popup au polygone
    layer.bindPopup(feature.properties.name);

    // Clic droit pour afficher le menu contextuel
    layer.on('contextmenu', function (event) {
        currentLayer = layer;  // Associer le polygone au menu contextuel
        showContextMenu(event.originalEvent);  // Afficher le menu contextuel
    });

    // Double clic pour zoomer directement
    layer.on('dblclick', function (event) {
        var bounds = layer.getBounds();  // Obtient les limites du polygone
        map.fitBounds(bounds, { padding: [20, 20] });  // Ajuster la vue pour englober le polygone
    });
}

