// ################# INITIALISATION DES CONSTANTES ################################# //

const params = {
  lat: 7.365302,
  lng: 12.343439,
};
const zoomlevel = 8;

const map = L.map("map-div").setView([params.lat, params.lng], zoomlevel);


function init() {
  const mainLayer = L.tileLayer(
    //"http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", j'ai remplace par open street map car pour raison inconnue ggogle deangeait
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {
      maxZoom: 20,
      //subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );

  mainLayer.addTo(map);


// CECI EST LE CALCULATEUR DE DISTANCE , POUR L'INSTANT IL N'A PAS ENCORE DE STYLE PERSONNALISE

// Ajout du calculateur de distance avec leaflet-measure
const measureControl = new L.Control.Measure({
  primaryLengthUnit: 'kilometers', 
  secondaryLengthUnit: 'meters',   
  primaryAreaUnit: 'sqmeters',     
  secondaryAreaUnit: 'hectares',    
  position: 'topright' 
});

// CECI EST LE CALCULATEUR DE DISTANCE , POUR L'INSTANT IL N'A PAS ENCORE DE STYLE PERSONNALISE
// map.addControl(measureControl); // Ajouter le calculateur à la carte

// Ajouter l'échelle de la carte
const scaleControl = L.control.scale({
  position: 'bottomleft', // Position personnalisée
  maxWidth: 200,
  metric: true,
  imperial: false
});
map.addControl(scaleControl);
}
/* INITIALISATION DE LA CARTE */
init();


