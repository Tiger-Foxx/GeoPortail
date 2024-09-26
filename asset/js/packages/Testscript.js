function init() {
  CameroonCoo = {
    lng: 7.3697,
    lat: 12.3547,
  };
  const zoom = 6;
  var map = L.map("map").setView([CameroonCoo.lng, CameroonCoo.lat], zoom);
  var mainLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );


  var baselayers = {
    OpenStreetMap: L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ),
    Satelite: L.tileLayer(
      "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    ),
    Topo: L.tileLayer(
      "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
    ),
  };
  baselayers.OpenStreetMap.addTo(map);
  // Ajouter le controleur de couches
  L.control
    .layers(baselayers, null, { position: "topright", collapsed: true })
    .addTo(map);

  // Ajouter l'echelle cartographique
  L.control.scale().addTo(map);
}

init();

