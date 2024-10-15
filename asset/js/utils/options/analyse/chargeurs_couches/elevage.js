function generateRandomLightRGBA() {
  const r = Math.floor(Math.random() * 56) + 200+3; // Valeur entre 200 et 255
  const g = Math.floor(Math.random() * 56) + 200+3; // Valeur entre 200 et 255
  const b = Math.floor(Math.random() * 56) + 200+3; // Valeur entre 200 et 255
  const a = 1;  // Transparence aléatoire entre 0 et 1 avec deux décimales

  return [r, g, b, a]; // Retourne le tuple (r, g, b, a)
}


var analVolaille={
    nom:"Consultations volailles",
    htmlID:"#analVolaille",
    layerName:"elevage:consultationespecesvolailles",
    url:"http://srv558546.hstgr.cloud:8080/geoserver/elevage/ows",
    layer:null,
    iconFunction: secondaireIcon ,
    color: generateRandomLightRGBA(),
    defaultProp:'consul2023',
  };