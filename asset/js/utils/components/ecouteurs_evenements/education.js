
/*
CE FICHIER REGROUPE LES ECOUTEURS D'EVENEMENTS POUR LE GROUPE EDUCATION

*/


/* EDUCATION */

$('#primaire').on("click", function () {
    //console.log('ok');
    UpdatePointsLayer(primaire);
  });
  
  $("#secondaire").on("click", function () {
    //console.log('ok');
    UpdatePointsLayer(secondaire);
  });
  
  $("#superieur").on("click", function () {
    UpdatePointsLayer(superieur);
  });
  
  /* EDUCATION */