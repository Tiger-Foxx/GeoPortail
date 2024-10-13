// ################# INITIALISATION DES CONSTANTES ################################# //
var loading=false;
var isInfo=false;
var isThematicMode=false;
const params = {
  lat: 7.365302,
  lng: 12.343439,
};
const zoomlevel = 10.5;

const map = L.map("map-div",{
  zoomDelta: 0.3,  // Diminue la taille du pas de zoom
  zoomSnap: 0.25,  // Rend le zoom plus fluide
  maxZoom: 25,

}).setView([params.lat, params.lng],zoomlevel);

var mainLayer=null;

function init() {
   mainLayer = L.tileLayer(
    //"http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", j'ai remplace par open street map car pour raison inconnue ggogle deangeait
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {
      maxZoom: 25,
      //subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );

  mainLayer.addTo(map);


// Ajout du calculateur de distance avec leaflet-measure
L.Measure = {
  linearMeasurement: "Mesure de distance",
  areaMeasurement: "Mesure de surface",
  start: "Debut",
  meter: "m",
  kilometer: "km",
  squareMeter: "m²",
  squareKilometers: "km²",
  };

  var measure = L.control.measure({
    collapsed: false,
    title: ""
  }).addTo(map); // Ajouter le calculateur à la carte
  // modifier le container du control.
  var htmlObject = measure.getContainer();
  var container = document.getElementById('mesure');
  container.appendChild(htmlObject);
  map.fitBounds([
    [3.088776111602783, 10.215944290161133],
    [6.277939319610596, 13.260499000549316]
  ]);






// Ajouter l'échelle de la carte
const scaleControl = L.control.scale({
  position: 'bottomleft', // Position personnalisée
  maxWidth: 200,
  metric: true,
  imperial: false
});
map.addControl(scaleControl);




// Ajouter la boussole
L.control.compass({
  autoActive: true,  // Active automatiquement la boussole
}).addTo(map);

L.control.locate({
  position: 'topright',
  setView: true,
  flyTo: true,
  iconElementTag: 'i',
  icon: 'fa-solid fa-location-crosshairs',  // Utilise une icône Font Awesome (par exemple)
  iconLoading: 'fa fa-spinner fa-spin',  // Icône pendant la localisation
  showPopup: true,  // Affiche la précision en popup
  strings: {
      title: "Clique pour te localiser",  // Personnalisation du texte
  },
  locateOptions: {
    enableHighAccuracy: true,  // Précision élevée
    timeout: 10000,  // Temps maximum pour obtenir une position en millisecondes
    maximumAge: 0  // Ne pas utiliser les positions précédemment mises en cache
}

}).addTo(map);




}



/* INITIALISATION DE LA CARTE */
init();
//Testloadlayer(map);


