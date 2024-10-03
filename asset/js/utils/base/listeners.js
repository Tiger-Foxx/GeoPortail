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


  $('#waterPoints').on('click', function(){

    $(this).toggleClass("open");
    if(layerGroup.hasLayer(waterPoints)){
     layerGroup.removeLayer(waterPoints);
      
      dropFromLayerList('lineWater');
    }else{
      layerGroup.addLayer(waterPoints);
      addToLayerList('lineWater');
    }
    // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
    setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);
  })

/* EDUCATION */

$('#primaire').on('click', function(){

  $(this).toggleClass("open");
  if(layerGroup.hasLayer(primaire)){
   layerGroup.removeLayer(primaire);
   dropFromLayerList('Ecoles Primaires');
   
  }else{
    layerGroup.addLayer(primaire);
    
    addToLayerList('Ecoles Primaires');
   
  }
  // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
  setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);
  NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

})



$('#secondaire').on('click', function(){

  $(this).toggleClass("open");
  if(layerGroup.hasLayer(secondaire)){
   layerGroup.removeLayer(secondaire);
   dropFromLayerList('Ecoles secondaire');
  }else{
    layerGroup.addLayer(secondaire);
    
    addToLayerList('Ecoles secondaire');
  }
  // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
  setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);
  NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

})


$('#superieur').on('click', function(){

  $(this).toggleClass("open");
  if(layerGroup.hasLayer(superieur)){
   layerGroup.removeLayer(superieur);
   dropFromLayerList('Ecoles superieur');
  }else{
    layerGroup.addLayer(superieur);
    
    addToLayerList('Ecoles superieur');
  }
  // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
  setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);
  NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

});

/* EDUCATION */




/* CENTRE */
  $('#departements').on('click', function(){

    $(this).toggleClass("open");
    if(layerBoundsGroup.hasLayer(departements)){
     layerBoundsGroup.removeLayer(departements);
      
    }else{
      layerBoundsGroup.addLayer(departements);
    }
   
  })

  $('#arrondissements').on('click', function(){

    $(this).toggleClass("open");
    if(layerBoundsGroup.hasLayer(arrondissements)){
     layerBoundsGroup.removeLayer(arrondissements);
      
    }else{
      layerBoundsGroup.addLayer(arrondissements);
    }
   
  })

  $('#communes').on('click', function(){

    $(this).toggleClass("open");
    if(layerBoundsGroup.hasLayer(communes)){
     layerBoundsGroup.removeLayer(communes);
      
    }else{
      layerBoundsGroup.addLayer(communes);
    }
   
  })

/*Couches globales*/

  $("#kmr1-dis").on("click", () => {
    map.addLayer(KBoundaries)
    if (!layerList.includes("countour du Cameroun"))
      addToLayerList("countour du Cameroun")
  })

  $("#kmr1-undis").on("click", () => {
    map.removeLayer(KBoundaries)
    dropFromLayerList("countour du Cameroun")
  })

  $("#kmr2-dis").on("click", () => {
    map.addLayer(KRegBoundaries)
    if (!layerList.includes("régions du Cameroun"))
      addToLayerList("régions du Cameroun")
  })

  $("#kmr2-undis").on("click", () => {
    map.removeLayer(KRegBoundaries)
    dropFromLayerList("régions du Cameroun")
  })

/* CENTRE */
  