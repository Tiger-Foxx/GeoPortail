/*
L'OBJECTIF DE CE FIHCHIER EST DE CHARGER LES DIFFERENTES DATAS GEO , IL DOIT ETRE JUSTE APRES LE FICHIER MAP.JS CAR IL DEPEND DE L'INITALISATION DE LA CARTE

UNE FOIS LES DATAS CHARGES ON AJOUTE LES OPTIONS DE DESSIN ET AUTRES

*/

/** INITIALISATION DES CONTANTES */

const EDUCATIONAL_POINTS = PointsEducatifs;
const HEATH_CENTERS=hopitaux;
const WATER_POINTS=CourtEau;

/** INITIALISATION DES CONTANTES */

async function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

/* CREATION DU LAYERGROUP */
// par defaut on masquera les layers pour que le chargement soit plus rapide
// var layerGroup = L.layerGroup([educationalPoints,heathCenters]);
var layerGroup = L.layerGroup([]);
var layerBoundsGroup=L.layerGroup([]); // un layergroup qui est different du precedent par ils ne s'agiut pas de points mais d'unite administratives
var layerList=[]   //UNE LISTE DE CHAINES QUI DONNES LES LABELS DES DIFFEENTS LAYERS

/* GEOJSON */
// var educationalPoints = AddPoints({pointsGoJson:EDUCATIONAL_POINTS,TheMap:map,color:'orange',fillColor:'pink'});
// var heathCenters = AddPoints({pointsGoJson:HEATH_CENTERS,TheMap:map,color:'red',fillColor:'green'});
// // CECI EST UN PAU PARTICULIER CAR IL NE S'AGIT PAS ICI DE POINTS MAIS DE LIGNES , ET C'EST COMME CECI QUE CA DEVRAS ETRE UTILISER QUAND ON AURAS LES VRAIES DONNEES
// var waterPoints = AddPoints({pointsGoJson:WATER_POINTS,TheMap:map,color:'blue',fillColor:'blue'});
/* GEOJSON */




/* CENTRE */
//var ArrondissementsCentre=AddPoints({fromGeoServer : true,TheMap:map, layer : 'PortalWorkSpace:Arrondissement Centre', url : 'http://localhost:8080/geoserver/PortalWorkSpace/wms',opacity:0.6});
var departements=null;
var arrondissements=null;
var communes=null;

// (async function() {
//     var color = await  getRandomColor();
//       departements = await AddPointsWFS({
//         fromGeoServer: true,
//         TheMap: map,
//         layer: 'centre:departements',
//         url: 'http://srv558546.hstgr.cloud:8080/geoserver/centre/wms',
//         opacity: 0.5,
//         fillColor:color ,
//         color: color,
//     });

//     // Ajouter le layer au layerBoundsGroup
//    // layerBoundsGroup.addLayer(departements);
// })();

// (async function() {
//   var color = await  getRandomColor();
//     communes = await AddPointsWFS({
//       fromGeoServer: true,
//       TheMap: map,
//       layer: 'centre:communes',
//       url: 'http://srv558546.hstgr.cloud:8080/geoserver/centre/wms',
//       opacity: 0.5,
//       fillColor:color ,
//       color: color,
//   });

//   // Ajouter le layer au layerBoundsGroup
//  // layerBoundsGroup.addLayer(departements);
// })();

// (async function() {
//   var color = await  getRandomColor();
//     arrondissements = await AddPointsWFS({
//       fromGeoServer: true,
//       TheMap: map,
//       layer: 'centre:arrondissement centre',
//       url: 'http://srv558546.hstgr.cloud:8080/geoserver/centre/wms',
//       opacity: 0.5,
//       fillColor:color ,
//       color: color,
//   });

//   // Ajouter le layer au layerBoundsGroup
//  // layerBoundsGroup.addLayer(departements);
// })();

/* CENTRE */




/* EDUCATION */

var superieur=null;
var secondaire=null;
var primaire= null;


// (async function() {
//     var color = await  getRandomColor();
//      primaire = await AddPointsWFS({
//         fromGeoServer: true,
//         TheMap: map,
//         layer: 'education:primaire',
//         url: 'http://srv558546.hstgr.cloud:8080/geoserver/education/ows',
//         opacity: 0.6,
//         fillColor:color ,
//         color: color,
//         icon:primaireIcon({color:color})
//     });

//     // Ajouter le layer au layerBoundsGroup
//     //layerGroup.addLayer(primaire);
// })();


// (async function() {
//     var color = await  getRandomColor();
//     superieur = await AddPointsWFS({
//        fromGeoServer: true,
//        TheMap: map,
//        layer: 'education:superieur',
//        url: 'http://srv558546.hstgr.cloud:8080/geoserver/education/ows',
//        opacity: 0.6,
//        fillColor:color ,
//        color:color ,
//        icon:superieurIcon({color:color})
//    });

//    // Ajouter le layer au layerBoundsGroup
//   // layerGroup.addLayer(superieur);
// })();


// (async function() {
//     var color = await  getRandomColor();
//     secondaire = await AddPointsWFS({
//        fromGeoServer: true,
//        TheMap: map,
//        layer: 'education:secondaire',
//        url: 'http://srv558546.hstgr.cloud:8080/geoserver/education/ows',
//        opacity: 0.6,
//        fillColor:color ,
//        color:color ,
//        icon:secondaireIcon({color:color})
//    });

//    // Ajouter le layer au layerBoundsGroup
//    //layerGroup.addLayer(secondaire);
// })();

/* EDUCATION */




/* LAYERSGROUP */

layerGroup.addTo(map);    
layerBoundsGroup.addTo(map); 

/* LAYERSGROUP */


initcenter =function () {
  if (departements != null && layerBoundsGroup.hasLayer(departements)) {
    layerBoundsGroup.removeLayer(departements);
  } else {
    if (departements == null) {
      (async function () {
        var color = await getRandomColor();
        departements = await AddPointsWFS({
          fromGeoServer: true,
          TheMap: map,
          layer: "centre:departements",
          url: "http://srv558546.hstgr.cloud:8080/geoserver/centre/wms",
          opacity: 0.5,
          fillColor: color,
          color: color,
        });

        // Ajouter le layer au layerBoundsGroup
        layerBoundsGroup.addLayer(departements);
      })();
    } else {
      layerBoundsGroup.addLayer(departements);
    }
  }
}()














/* LEGENDE  */


// // Fonction pour créer la légende
// var legend = L.control({
//    position: 'bottomleft',
//    title: 'legend'

//  });

// legend.onAdd = function (map) {
//     // Conteneur pour la légende
//     var div = L.DomUtil.create('div', 'info legend');

//     // Catégories à afficher dans la légende
//     var categories = ['École', 'Hôpital'];
//     var colors = ['#00FF00', '#FF0000'];  // Couleurs associées

//     // Boucle pour ajouter les éléments de légende
//     for (var i = 0; i < categories.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + colors[i] + '"></i> ' +
//             categories[i] + '<br><br>';
//     }

//     return div;
// };

// // Ajouter la légende à la carte
// legend.addTo(map);





/* LEGENDE  */


























// ########### OPTIONS DE DESSIN ############################ //

var drawnItems= InitDraw(TheMap=map);
NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

// Initialiser la barre de recherche pour la recherche de pointsd chargees dans le layergroup  juste

setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);