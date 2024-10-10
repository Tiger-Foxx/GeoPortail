/** CE FICHIER CONTIENT LES FONCTIONS QUI SERVENT A AFFICHER OU MASQUER UNE COUCHE QUE CE SOIT DES POINTS OU DES POLYGONES */

async function  UpdateBoundsLayer(Couche) {
  if (!loading) {
    //document.getElementById(Couche.htmlID).classList.toggle("open");
     $(Couche.htmlID).toggleClass("open");
    if (Couche.layer != null && layerBoundsGroup.hasLayer(Couche.layer)) {
      layerBoundsGroup.removeLayer(Couche.layer);
    } else {
      if (Couche.layer == null) {
        (async function () {
          var color = await getRandomColor();
          Couche.layer = await AddPointsWFS({
            fromGeoServer: true,
            TheMap: map,
            layer: Couche.layerName,
            url: Couche.url,
            opacity: 0.5,
            fillColor: color,
            color: color,
          });

          Couche.layer.nom=Couche.nom;
  
          // Ajouter le layer au layerBoundsGroup
          layerBoundsGroup.addLayer(Couche.layer);
        })();
      } else {
        layerBoundsGroup.addLayer(Couche.layer);
      }
    }
  }else{
   notis.create("Attention", "Une couche est dejà en cours de chargement ....", 4);
 }
}

async function  UpdatePointsLayer(Couche) {
  if (!loading) {
    //document.getElementById(Couche.htmlID).classList.toggle("open");

    $(Couche.htmlID).toggleClass("open");
  
   
     if (Couche.layer != null && layerGroup.hasLayer(Couche.layer)) {
       layerGroup.removeLayer(Couche.layer);
       dropFromLayerList(Couche.layer.nom);
       return 0;
     } else {
       if (Couche.layer == null) {
         (async function () {
           var color = await getRandomColor();
           Couche.layer = await AddPointsWFS({
             fromGeoServer: true,
             TheMap: map,
             layer: Couche.layerName,
            url: Couche.url,
             opacity: 0.6,
             fillColor: color,
             color: color,
             icon: Couche.iconFunction({ color: color }),
           });
           Couche.layer.nom=Couche.nom;
           // Ajouter le layer au layerBoundsGroup
           layerGroup.addLayer(Couche.layer);
           // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
           setupSearch((geoJsonLayers = layerGroup.getLayers()), (TheMap = map));
           NewCountEntytiesInZone(
             (GeoPointsDatasList = layerGroup.getLayers()),
             (drawnItems = drawnItems),
             (labels = layerList),
             (TheMap = map)
           );
           addToLayerList(Couche.layer.nom);
           
         })();
         
       } else {
         layerGroup.addLayer(Couche.layer);
         // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
         setupSearch((geoJsonLayers = layerGroup.getLayers()), (TheMap = map));
         NewCountEntytiesInZone(
           (GeoPointsDatasList = layerGroup.getLayers()),
           (drawnItems = drawnItems),
           (labels = layerList),
           (TheMap = map)
         );
         addToLayerList(Couche.layer.nom);
       }
       return 0;
     }
   }else{
    notis.create("Attention", "Une couche est dejà en cours de chargement ....", 4);
    return -1;
  }

}


















