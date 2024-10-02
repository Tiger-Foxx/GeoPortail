/** CE FICHIER CONTIENT LES ECOUTEURS D'EVENEMENT A INITIALISER */

// Fonction pour ajouter une chaîne à la liste
function addToLayerList(chaine) {
  layerList.push(chaine);
  console.log("Élément ajouté :", chaine);
}

// Fonction pour supprimer une chaîne de la liste
function dropFromLayerList(chaine) {
  const index = layerList.indexOf(chaine);
  if (index !== -1) {
    layerList.splice(index, 1);
    console.log("Élément supprimé :", chaine);
  } else {
    console.log("Élément non trouvé :", chaine);
  }
}
// on parcours la liste des layers (utils/layerList.js) et on y applique un evenement au click
for (let i = 0; i < layersList.length; i++) {
  const layer = layersList[i];
  $('.' + layer.classButton).on('click', function(){
    $(this).toggleClass("open");
    if(layerGroup.hasLayer(layer.data)){
      layerGroup.removeLayer(layer.data);
      dropFromLayerList(layer.name);

    }else{
      layerGroup.addLayer(layer.data);
      addToLayerList(layer.name);
    }

    if(layer.resetSearch){
      // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
      setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);
      NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)
    }
  })
  
}


