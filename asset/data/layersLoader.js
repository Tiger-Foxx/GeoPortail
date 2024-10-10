/*
L'OBJECTIF DE CE FIHCHIER EST DE CHARGER LES DIFFERENTES DATAS GEO , IL DOIT ETRE JUSTE APRES LE FICHIER MAP.JS CAR IL DEPEND DE L'INITALISATION DE LA CARTE

UNE FOIS LES DATAS CHARGES ON AJOUTE LES OPTIONS DE DESSIN ET AUTRES

*/

/** INITIALISATION DES CONTANTES */

const EDUCATIONAL_POINTS = PointsEducatifs;
const HEATH_CENTERS=hopitaux;
const WATER_POINTS=CourtEau;
const KMRBOUNDARIES = kmrBoundaries;
const KMRREGBOUNDARIES = kmrRegBoundaries;
const KMRDEPBOUNDARIES = kmrDepBoundaries;
const KMRARRBOUNDARIES = kmrArrBoundaries;

/** INITIALISATION DES CONTANTES */


/* AJOUT DU SET DE POINTS GEOJSON A LA CARTE */
var educationalPoints = AddPoints(EDUCATIONAL_POINTS,TheMap=map,color='orange',fillColor='pink');
var heathCenters = AddPoints(HEATH_CENTERS,TheMap=map,color='red',fillColor='green');

// CECI EST UN PAU PARTICULIER CAR IL NE S'AGIT PAS ICI DE POINTS MAIS DE LIGNES , ET C'EST COMME CECI QUE CA DEVRAS ETRE UTILISER QUAND ON AURAS LES VRAIES DONNEES
var waterPoints = AddPoints(WATER_POINTS,TheMap=map,color='blue',fillColor='blue');

//Couche du contour du Cameroun sous format geoJSON
var KBoundaries = L.geoJSON(KMRBOUNDARIES, {
    style: {}
})

//GeoJSON des régions du Cameroun
var KRegBoundaries = L.geoJSON(KMRREGBOUNDARIES, {
    style: {}
})

var KDepBoundaries = L.geoJSON(KMRDEPBOUNDARIES, {
    style: {}
})

var KArrBoundaries = L.geoJSON(KMRARRBOUNDARIES, {
    style: {}
})

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