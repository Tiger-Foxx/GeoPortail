/* FICHIER ESSENTIELLEMT DEDIEE A DES FONCTIONALITES EN COURS DE TESTS */

function Testloadlayer(TheMap) {
    // Ajouter une couche WMS à la carte
    layer=L.tileLayer.wms('http://localhost:8080/geoserver/PortalWorkSpace/wms', {
        layers: 'PortalWorkSpace:Arrondissement Centre',
        format: 'image/png', // Ajuster pour correspondre au format qui fonctionne
        transparent: true,
        attribution: "GeoServer",
        width: 512,             // Augmente la largeur
        height: 512,            // Augmente la hauteur
        opacity: 0.6,

    })
    layer.addTo(TheMap);
    console.log("Couche WMS chargée avec succès : " + layer.geom);
    layer.on('tileerror', function(error, tile) {
        console.error("Erreur lors du chargement de la tuile WMS : ", error);
        console.log(error);
      });
      
  
}

