// utils/recherche.js
var searchResultDiv = document.getElementById('search-result');
searchResultDiv.display='none';


/**
 * Fonction qui gère la recherche dans les points et lignes GeoJSON et affiche les résultats.
 * 
 * @param {List(L.GeoJSON)} geoJsonLayers - Les layers GeoJSON contenant les points et lignes à rechercher
 * @param {L.Map} TheMap - La carte Leaflet
 */
function setupSearch(geoJsonLayers, TheMap) {
    const searchInput = document.getElementById('search-input');
    const searchResultDiv = document.getElementById('search-result');

    // Supprimer les anciens écouteurs d'événements pour éviter la duplication
    searchInput.removeEventListener('input', handleSearch);

    // Fonction de gestion de la recherche
    function handleSearch() {
        const query = searchInput.value.toLowerCase();
        searchResultDiv.innerHTML = ''; // Effacer les anciens résultats
        searchResultDiv.style.display = 'block'; // Assurer que la zone de résultat est visible

        if (query.length === 0) return; // Ne rien faire si la barre est vide

        let filteredResults = []; // Tableau pour stocker tous les résultats filtrés

        // Parcourir chaque GeoJSONLayer dans la liste
        geoJsonLayers.forEach(geoJsonLayer => {
            const layers = geoJsonLayer.getLayers();

            // Filtrer les résultats en fonction du nom
            filteredResults = filteredResults.concat(
                layers.filter(layer => {
                    const name = layer.feature.properties.name || '';
                    return name.toLowerCase().includes(query);
                })
            );
        });

        // Limiter à 5 résultats
        filteredResults = filteredResults.slice(0, 5);

        // Afficher les résultats dans la div
        filteredResults.forEach(layer => {
            const name = layer.feature.properties.name || 'Nom inconnu';
            const geometryType = layer.feature.geometry.type;
            let coordinates;

            // Vérifier le type de géométrie pour obtenir les coordonnées appropriées
            if (geometryType === 'Point') {
                coordinates = layer.getLatLng();
            } else if (geometryType === 'LineString') {
                // Prendre la première coordonnée de la ligne
                const latLngs = layer.getLatLngs();
                coordinates = latLngs[0]; // Prendre le premier point de la ligne
            }

            // Créer un élément pour chaque résultat
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            resultItem.textContent = name;

            // Ajouter l'élément au container de résultats
            searchResultDiv.appendChild(resultItem);

            // Ajouter un écouteur de clic pour zoomer sur le lieu/lignestring
            resultItem.addEventListener('click', function () {
                console.log('Lieu cliqué : ' + resultItem.textContent);
                if (geometryType === 'Point') {
                    TheMap.setView(coordinates, 15); // Zoom sur le point
                } else if (geometryType === 'LineString') {
                    TheMap.fitBounds(layer.getBounds()); // Zoom sur toute la ligne
                }
                layer.openPopup(); // Ouvrir le popup du lieu
                searchResultDiv.style.display = 'none'; // Cacher la zone de résultats après sélection
            });
        });

        // Si aucun résultat trouvé
        if (filteredResults.length === 0) {
            const noResultItem = document.createElement('div');
            noResultItem.classList.add('search-result-item');
            noResultItem.textContent = 'Aucun résultat trouvé';
            searchResultDiv.appendChild(noResultItem);
        }
    }

    // Ajouter le nouvel écouteur d'événements
    searchInput.addEventListener('input', handleSearch);
}
