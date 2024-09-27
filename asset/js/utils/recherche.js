// utils/recherche.js
var searchResultDiv = document.getElementById('search-result');
searchResultDiv.display='none';
/**
 * Fonction qui gère la recherche dans les points GeoJSON et affiche les résultats.
 * 
 * @param {List(L.GeoJSON)} geoJsonLayers - Les layers GeoJSON contenant les points à rechercher
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

        let filteredPoints = []; // Tableau pour stocker tous les résultats filtrés

        // Parcourir chaque GeoJSONLayer dans la liste
        geoJsonLayers.forEach(geoJsonLayer => {
            // Obtenir tous les points GeoJSON du layer
            const points = geoJsonLayer.getLayers();

            // Filtrer les résultats en fonction du nom
            filteredPoints = filteredPoints.concat(
                points.filter(layer => {
                    const name = layer.feature.properties.name || '';
                    return name.toLowerCase().includes(query);
                })
            );
        });

        // Limiter à 5 résultats
        filteredPoints = filteredPoints.slice(0, 5);

        // Afficher les résultats dans la div
        filteredPoints.forEach(layer => {
            const name = layer.feature.properties.name || 'Nom inconnu';
            const coordinates = layer.getLatLng();

            // Créer un élément pour chaque résultat
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            resultItem.textContent = name;

            // Ajouter l'élément au container de résultats
            searchResultDiv.appendChild(resultItem);

            // Ajouter un écouteur de clic pour zoomer sur le lieu
            resultItem.addEventListener('click', function () {
                console.log('Lieu cliqué : ' + resultItem.textContent);
                TheMap.setView(coordinates, 15); // Zoomer sur le point avec un zoom de niveau 15
                layer.openPopup(); // Ouvrir le popup du lieu
                searchResultDiv.style.display = 'none'; // Cacher la zone de résultats après sélection
            });
        });

        // Si aucun résultat trouvé
        if (filteredPoints.length === 0) {
            const noResultItem = document.createElement('div');
            noResultItem.classList.add('search-result-item');
            noResultItem.textContent = 'Aucun résultat trouvé';
            searchResultDiv.appendChild(noResultItem);
        }
    }

    // Ajouter le nouvel écouteur d'événements
    searchInput.addEventListener('input', handleSearch);
}

