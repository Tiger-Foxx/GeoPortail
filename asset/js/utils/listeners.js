/** CE FICHIER CONTIENT LES ECOUTEURS D'EVENEMENT A INITIALISER */




$('#educationalPoints').on('click', function(){
    $(this).toggleClass("open");
    if(layerGroup.hasLayer(educationalPoints)){
      layerGroup.removeLayer(educationalPoints);
    }else{
      layerGroup.addLayer(educationalPoints);
    }
  })

  // PREVUS POUR D'AUTRES OPTIONS 

  $('#autresPoints').on('click', function(){
    $(this).toggleClass("open");
    // if(layerGroup.hasLayer(educationalPoints)){
    //   layerGroup.removeLayer(educationalPoints);
    // }else{
    //   layerGroup.addLayer(educationalPoints);
    // }
  })
  