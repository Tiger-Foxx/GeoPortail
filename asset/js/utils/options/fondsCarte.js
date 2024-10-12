let currentFond = null; // Variable globale pour suivre le fond de carte actuellement actif
let isOSM=true;
function changeBaseMap(map, tileFondUrl, FondOptions = {}) {
  // Si le fond de carte actuel est le même que celui qu'on essaie d'appliquer
  if (currentFond && currentFond._url === tileFondUrl) {
    map.removeLayer(currentFond); // Supprimer le fond de carte
    currentFond = null; // Réinitialiser la variable
    console.log("Fond de carte supprimé");
  } else {
    // Si un autre fond de carte est actif, on le retire avant d'appliquer le nouveau
    if (currentFond) {
      map.removeLayer(currentFond);
    }

    // Appliquer le nouveau fond de carte
    currentFond = L.tileLayer(tileFondUrl, FondOptions);
    currentFond.addTo(map);
    console.log("Nouveau fond de carte appliqué");
  }
}

const osmTileLayer = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const googleRoadmapTileLayer = "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
const googleSatelliteTileLayer = "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
const googleHybridTileLayer = "http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
const cartoVoyagerTileLayer = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const stamenTerrainTileLayer = "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg";
const stamenTonerTileLayer = "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png";
const esriWorldImageryTileLayer = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const thunderforestOutdoorsTileLayer = "https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=<YOUR_API_KEY>";

$("#OSM").on("click", function () {
    if (isOSM) {
    map.removeLayer(mainLayer); // Retirer le fond de carte actuel
    //currentLayer = null; // Réinitialiser la variable
    console.log("Fond de carte désactivé");
    isOSM=false;
    } else {
        mainLayer = L.tileLayer(
            //"http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", j'ai remplace par open street map car pour raison inconnue ggogle deangeait
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        
            {
              maxZoom: 25,
              //subdomains: ["mt0", "mt1", "mt2", "mt3"],
            }
          );
        
          mainLayer.addTo(map);
          isOSM=true;
    }
    
  });
$("#satelite").on("click", function () {
    changeBaseMap(map, googleSatelliteTileLayer, {subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], maxZoom: 25})
  });

$("#road").on("click", function () {
    changeBaseMap(map, googleRoadmapTileLayer, {subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], maxZoom: 25})
  });


  $("#hybrid").on("click", function () {
    changeBaseMap(map, googleHybridTileLayer, {subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], maxZoom: 25})
  });




  $("#voyager").on("click", function () {
    changeBaseMap(map, cartoVoyagerTileLayer)
  });

  $("#terrain").on("click", function () {
    changeBaseMap(map, stamenTerrainTileLayer)
  });

  $("#toner").on("click", function () {
    changeBaseMap(map, stamenTonerTileLayer)
  });

  $("#esri").on("click", function () {
    changeBaseMap(map, esriWorldImageryTileLayer)
  });

  $("#thunderforest").on("click", function () {
    changeBaseMap(map, thunderforestOutdoorsTileLayer)
  });
  
  

