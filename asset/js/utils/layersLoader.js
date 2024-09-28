/*
L'OBJECTIF DE CE FIHCHIER EST DE CHARGER LES DIFFERENTES DATAS GEO , IL DOIT ETRE JUSTE APRES LE FICHIER MAP.JS CAR IL DEPEND DE L'INITALISATION DE LA CARTE

UNE FOIS LES DATAS CHARGES ON AJOUTE LES OPTIONS DE DESSIN ET AUTRES

*/



const EDUCATIONAL_POINTS = PointsEducatifs;
const HEATH_CENTERS=hopitaux;


/* AJOUT DU SET DE POINTS GEOJSON A LA CARTE */
var educationalPoints = AddPoints(EDUCATIONAL_POINTS,TheMap=map);
var heathCenters = AddPoints(HEATH_CENTERS,TheMap=map,color='red',fillColor='green');

/* CREATION DU LAYERGROUP */
// par defaut on masquera les layers pour que le chargement soit plus rapide
// var layerGroup = L.layerGroup([educationalPoints,heathCenters]);
var layerGroup = L.layerGroup([]);
//UNE LISTE DE CHAINES QUI DONNES LES LABELS DES DIFFEENTS LAYERS
var layerList=[]
layerGroup.addTo(map);    // Adding layer group to map



// ########### OPTIONS DE DESSIN ############################ //

var drawnItems= InitDraw(TheMap=map);
NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

// Initialiser la barre de recherche pour la recherche de pointsd chargees dans le layergroup  juste

setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);