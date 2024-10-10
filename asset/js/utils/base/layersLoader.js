/*
L'OBJECTIF DE CE FIHCHIER EST DE CHARGER LES DIFFERENTES DATAS GEO , IL DOIT ETRE JUSTE APRES LE FICHIER MAP.JS CAR IL DEPEND DE L'INITALISATION DE LA CARTE

UNE FOIS LES DATAS CHARGES ON AJOUTE LES OPTIONS DE DESSIN ET AUTRES

*/

/* COULEUR AU HASARD FONCTION UTILITAIRE */

async function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}





/* LAYERSGROUP */

/* CREATION DU LAYERGROUP */
var layerGroup = L.layerGroup([]);
var layerBoundsGroup=L.layerGroup([]); // un layergroup qui est different du precedent par ils ne s'agiut pas de points mais d'unite administratives
var layerList=[]   //LISTE DE CHAINES QUI DONNES LES LABELS DES DIFFEENTS LAYERS

layerGroup.addTo(map);    
layerBoundsGroup.addTo(map); 



// Fonction pour ajouter une chaîne à la liste
function addToLayerList(chaine) {
  layerList.unshift(chaine);
  console.log("Élément ajouté :", chaine);
  console.log('layers presents', layerList);
  updateLegend(layerGroup);

}

// Fonction pour supprimer une chaîne de la liste
function dropFromLayerList(chaine) {
  const index = layerList.indexOf(chaine);
  if (index !== -1) {
    layerList.splice(index, 1);
    console.log("Élément supprimé :", chaine);
    console.log('layers presents', layerList);
    updateLegend(layerGroup);
  } else {
    console.log("Élément non trouvé :", chaine);
  }
}



/* LAYERSGROUP */



/* CHARGEMENT DU CENTRE */
var departements={
  nom:"Departements",
  htmlID:"#departements",
  layerName:"centre:departements",
  url:"http://srv558546.hstgr.cloud:8080/geoserver/centre/wms",
  layer:null,
};
initCenter = async function () {
  if (departements.layer != null && layerBoundsGroup.hasLayer(departements.layer)) {
    layerBoundsGroup.removeLayer(departements.layer);
  } else {
    if (departements.layer == null) {
      
      $('#departements').toggleClass("open");
      (async function () {
        var color = await getRandomColor();
        departements.layer = await AddPointsWFS({
          fromGeoServer: true,
          TheMap: map,
          layer: "centre:departements",
          url: "http://srv558546.hstgr.cloud:8080/geoserver/centre/wms",
          opacity: 0.5,
          fillColor: color,
          color: color,
        });
        console.log(departements.layer);
        departements.layer.nom=departements.nom;
        
        // Ajouter le layer au layerBoundsGroup
        layerBoundsGroup.addLayer(departements.layer);
      })();
    } else {
      layerBoundsGroup.addLayer(departements.layer);
    }
  }
}()


/* CHARGEMENT DU CENTRE */








































/* DESSIN */

var drawnItems= InitDraw(TheMap=map);
NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

/* DESSIN */

/* RECHERCHE DE POINTS */

setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);

/* RECHERCHE DE POINTS */
