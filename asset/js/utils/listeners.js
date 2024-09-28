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

//['points educatifs','centres de santé','points d\'eau']

$('#educationalPoints').on('click', function(){
    $(this).toggleClass("open");
    if(layerGroup.hasLayer(educationalPoints)){
      layerGroup.removeLayer(educationalPoints);
      dropFromLayerList('points educatifs');

    }else{
      layerGroup.addLayer(educationalPoints);
      addToLayerList('points educatifs');
    }
        // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup

    setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);
    NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

  })

  // PREVUS POUR D'AUTRES OPTIONS 

  $('#centresSante').on('click', function(){

    $(this).toggleClass("open");
    if(layerGroup.hasLayer(heathCenters)){
     layerGroup.removeLayer(heathCenters);
     dropFromLayerList('centres de santé');
    }else{
      layerGroup.addLayer(heathCenters);
      
      addToLayerList('centres de santé');
    }
    // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
    setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);
    NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

  })


  // $('#waterPoints').on('click', function(){

  //   $(this).toggleClass("open");
  //   if(layerGroup.hasLayer(heathCenters)){
  //    layerGroup.removeLayer(heathCenters);
  //     
    //   dropFromLayerList('points d\'eau');
  //   }else{
  //     layerGroup.addLayer(heathCenters);
  //     addToLayerList('points d\'eau');
  //   }
  //   // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
  //   setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);
  // })
  