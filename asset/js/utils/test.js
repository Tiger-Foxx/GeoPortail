/* FICHIER ESSENTIELLEMT DEDIEE A DES FONCTIONALITES EN COURS DE TESTS */

function Testloadlayer(TheMap) {
    L.tileLayer('http://localhost:8080/geoserver/wms', {
        layers: 'PortalWorkSpace:Arrondissement Centre',
        format: 'image/png',
        transparent: true,
        attribution: "GeoServer"
    }).addTo(TheMap);
}

