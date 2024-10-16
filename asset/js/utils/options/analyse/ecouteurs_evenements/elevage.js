function generateRandomLightRGBA() {
  const r = Math.floor(Math.random() * 56) + 200+3; // Valeur entre 200 et 255
  const g = Math.floor(Math.random() * 56) + 200+3; // Valeur entre 200 et 255
  const b = Math.floor(Math.random() * 56) + 200+3; // Valeur entre 200 et 255
  const a = 1;  // Transparence aléatoire entre 0 et 1 avec deux décimales

  return [r, g, b, a]; // Retourne le tuple (r, g, b, a)
}
/* ELEVAGE */

/* CONSULTATION */
$('#analVolaille_consultation').on("click", function () {
    //console.log('ok');
    UpdateBoundsLayerAnalysis({Couche:analVolaille_consultation});
  });

  const speciesData = [
    { name: "Asines", icon: "fa-democrat", layerName: "elevage:consultationespecesasine", htmlID: "analAsine_consultation" },
    { name: "Caprines", icon: "fa-syringe", layerName: "elevage:consultationespecescaprines", htmlID: "analCaprine_consultation" },
    { name: "Equines", icon: "fa-horse", layerName: "elevage:consultationespecesequine", htmlID: "analEquine_consultation" },
    { name: "Felines", icon: "fa-dog", layerName: "elevage:consultationespecesfélines", htmlID: "analFeline_consultation" },
    { name: "Alpines", icon: "fa-syringe", layerName: "elevage:consultationespecesalpines", htmlID: "analAlpine_consultation" },
    { name: "Ovines", icon: "fa-egg", layerName: "elevage:consultationespecesovines", htmlID: "analOvine_consultation" },
    { name: "Porcines", icon: "fa-piggy-bank", layerName: "elevage:consultationespecesporcines", htmlID: "analPorcine_consultation" },
  ];

  let htmlContent = "";
  let htmlContentTitle=` <hr />
            <h5 >CONSULTATIONS</h5>
            <hr />
            `;
  //htmlContent+=htmlContentTitle;

  speciesData.forEach(species => {
    htmlContent += `
      <div class="grid-element btn-menu rel js-btn-c-menu">
        <div class="icon-menu">
          <i class="fa-solid ${species.icon}"></i>
        </div>
        <span class="text-menu">CONSULT <br> ${species.name.toUpperCase()}</span>
        <div class="c-menu" style="display: none">
          <div class="cm-el theme" id="${species.htmlID}">
            <div class="aff">
              <i class="fa-solid fa-eye"></i>
              <span>Afficher</span>
            </div>
            <div class="cac">
              <i class="fa-solid fa-eye-slash"></i>
              <span>Cacher</span>
            </div>
          </div>
          <div class="cm-el">
            <i class="fa-solid fa-circle-info"></i>
            <span>Informations</span>
          </div>
        </div>
      </div>
    `;
  });
  
  // Insérer le contenu généré dans ton HTML
  document.getElementById("elevage").innerHTML += htmlContent;

  speciesData.forEach(species => {
    // Génération du chargeur de couche
    window[`anal${species.name}_consultation`] = {
      nom: `Consultations ${species.name.toLowerCase()}`,
      htmlID: `#${species.htmlID}`,
      layerName: species.layerName,
      url: "http://srv558546.hstgr.cloud:8080/geoserver/elevage/ows",
      layer: null,
      iconFunction: window[`${species.name.toLowerCase()}Icon`] || function({color = 'red'}) {
        return L.divIcon({
          className: 'custom-div-icon',
          html: `<i class='fa-solid ${species.icon}' style='font-size: 25px; color: ${color};'></i>`,
          iconSize: [25, 25], // Taille du conteneur
          iconAnchor: [0, 0] // Ancre de l'icône
        });
      },
      color: generateRandomLightRGBA(),
      defaultProp: 'consul2023',
    };
  
    // Ajout de l'écouteur d'événement
    $(`#${species.htmlID}`).on("click", function () {
      UpdateBoundsLayerAnalysis({ Couche: window[`anal${species.name}_consultation`] });
    });
  });



/* ELEVAGE */