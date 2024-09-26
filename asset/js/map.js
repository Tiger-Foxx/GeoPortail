// ################# INITIALISATION DES CONSTANTES ################################# //

const params = {
  lat: 7.365302,
  lng: 12.343439,
};
const zoomlevel = 10;

const map = L.map("map-div").setView([params.lat, params.lng], zoomlevel);

const EDUCATIONAL_POINTS = PointsEducatifs;


function init() {
  const mainLayer = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );

  mainLayer.addTo(map);
}














/* INITIALISATION DE LA CARTE */

init();

/* AJOUT DU SET DE POINTS GEOJSON A LA CARTE */

var educationalPoints=AddPoints(EDUCATIONAL_POINTS,TheMap=map);

// ########### OPTIONS DE DESSIN ############################ //

var drawnItems= InitDraw(TheMap=map);
CountEntytiesInZone(GeoPointsDatas=educationalPoints , drawnItems=drawnItems , label='points educatifs',TheMap=map)

