/*
L'OBJECTIF DE CE FIHCHIER EST DE CHARGER LES DIFFERENTES DATAS GEO , IL DOIT ETRE JUSTE APRES LE FICHIER MAP.JS CAR IL DEPEND DE L'INITALISATION DE LA CARTE

UNE FOIS LES DATAS CHARGES ON AJOUTE LES OPTIONS DE DESSIN ET AUTRES

*/



async function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function generateRandomLightRGBA() {
    const r = Math.floor(Math.random() * 56) + 200; // Valeur entre 200 et 255
    const g = Math.floor(Math.random() * 56) + 200; // Valeur entre 200 et 255
    const b = Math.floor(Math.random() * 56) + 200; // Valeur entre 200 et 255
    const a = Math.random().toFixed(2);  // Transparence aléatoire entre 0 et 1 avec deux décimales

    return [r, g, b, a]; // Retourne le tuple (r, g, b, a)
}

/* CREATION DU LAYERGROUP */
// par defaut on masquera les layers pour que le chargement soit plus rapide
var layerGroup = L.layerGroup([]);
var layerBoundsGroup=L.layerGroup([]); // un layergroup qui est different du precedent par ils ne s'agiut pas de points mais d'unite administratives
var layerList=[]   //UNE LISTE DE CHAINES QUI DONNES LES LABELS DES DIFFEENTS LAYERS

var layerBoundsGroupAnalysis=L.layerGroup([]); // un layergroup qui est different du precedent par ils ne s'agiut pas de points mais d'unite administratives
var layerListAnalysis=[]   //UNE LISTE DE CHAINES QUI DONNES LES LABELS DES DIFFEENTS LAYERS



/* LAYERSGROUP */

layerGroup.addTo(map);    
layerBoundsGroup.addTo(map); 
layerBoundsGroupAnalysis.addTo(map); 


let rang = 0;


// Fonction pour ajouter une chaîne à la liste
function addToLayerList(chaine) {
  layerList.unshift(chaine);
  console.log("Élément ajouté :", chaine);
  console.log('layers presents', layerList);
  updateLegend(layerGroup);
  rang++;
  console.log(rang)
  $("#nbr-couche").text(rang);
  $("#nbr-couche").show();
  layerView.create(rang, null, chaine);
  loadShort()

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



var departements={
  nom:"Departements",
  htmlID:"#departements",
  layerName:"centre:departements",
  url:"http://srv558546.hstgr.cloud:8080/geoserver/centre/wms",
  layer:null,
};

initCenter =function () {
  if (departements.layer != null && layerBoundsGroup.hasLayer(departements.layer)) {
    layerBoundsGroup.removeLayer(departements.layer);
  } else {
    if (departements.layer == null) {
      $('#departements').toggleClass("open");
      (async function () {
        var color = '#05512DFF';
        departements.layer = await AddPointsWFS({
          fromGeoServer: true,
          TheMap: map,
          layer: departements.layerName,
          url: departements.url,
          opacity: 0.5,
          fillColor: color,
          color: color,
          showLabel: true,
        });
        departements.layer.nom=departements.nom;
        // Ajouter le layer au layerBoundsGroup
        layerBoundsGroup.addLayer(departements.layer);
      })();
    } else {
      layerBoundsGroup.addLayer(departements.layer);
    }
  }
}()





































/* DESSIN */

var drawnItems= InitDraw(TheMap=map);
NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

/* DESSIN */


/* RECHERCHE */

setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);

/* RECHERCHE */