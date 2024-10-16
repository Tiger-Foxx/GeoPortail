function generateRandomLightRGBA() {
    const r = Math.floor(Math.random() * 56) + 200+3; // Valeur entre 200 et 255
    const g = Math.floor(Math.random() * 56) + 200+3; // Valeur entre 200 et 255
    const b = Math.floor(Math.random() * 56) + 200+3; // Valeur entre 200 et 255
    const a = 1;  // Transparence aléatoire entre 0 et 1 avec deux décimales
  
    return [r, g, b, a]; // Retourne le tuple (r, g, b, a)
  }
  /* AGRICULTURE */
  
  /* PRODUCTION */
  const agricultureData = [
    { name: "Ananas", icon: "fa-apple-alt", layerName: "agriculture:productionAnanas", htmlID: "analAnanas_production" },
    { name: "Arachides", icon: "fa-seedling", layerName: "agriculture:productionArachides", htmlID: "analArachides_production" },
    { name: "BananePlantain", icon: "fa-leaf", layerName: "agriculture:productionBananePlantain", htmlID: "analBananePlantain_production" },
    { name: "Cacao", icon: "fa-coffee", layerName: "agriculture:productionCacao", htmlID: "analCacao_production" },
    { name: "CafeRobusta", icon: "fa-mug-hot", layerName: "agriculture:productionCafeRobusta", htmlID: "analCafeRobusta_production" },
    { name: "HuileDePalme", icon: "fa-oil-can", layerName: "agriculture:productionHuileDePalme", htmlID: "analHuileDePalme_production" },
    { name: "Ignames", icon: "fa-carrot", layerName: "agriculture:productionIgnames", htmlID: "analIgnames_production" },
    { name: "Pasteques", icon: "fa-water", layerName: "agriculture:productionPasteques", htmlID: "analPasteques_production" },
    { name: "RizPaddy", icon: "fa-seedling", layerName: "agriculture:productionRizPaddy", htmlID: "analRizPaddy_production" },
    { name: "Sesame", icon: "fa-leaf", layerName: "agriculture:productionSesame", htmlID: "analSesame_production" },
    { name: "Soja", icon: "fa-seedling", layerName: "agriculture:productionSoja", htmlID: "analSoja_production" },
    { name: "TaroMacabo", icon: "fa-seedling", layerName: "agriculture:productionTaroMacabo", htmlID: "analTaroMacabo_production" },
    { name: "Tomates", icon: "fa-seedling", layerName: "agriculture:productionTomates", htmlID: "analTomates_production" },
    { name: "CafeRobustaLower", icon: "fa-mug-hot", layerName: "agriculture:productioncaferobusta", htmlID: "analCafeRobustaLower_production" },
    { name: "Concombre", icon: "fa-carrot", layerName: "agriculture:productionconcombre", htmlID: "analConcombre_production" },
    { name: "Gingembre", icon: "fa-seedling", layerName: "agriculture:productiongingembre", htmlID: "analGingembre_production" },
    { name: "Gombo", icon: "fa-seedling", layerName: "agriculture:productiongombo", htmlID: "analGombo_production" },
    { name: "HaricotsSecs", icon: "fa-leaf", layerName: "agriculture:productionharicotssecs", htmlID: "analHaricotsSecs_production" },
    { name: "Mais", icon: "fa-seedling", layerName: "agriculture:productionmais", htmlID: "analMais_production" },
    { name: "Manioc", icon: "fa-seedling", layerName: "agriculture:productionmanioc", htmlID: "analManioc_production" },
  ];
  
  let htmlContent_agro_prod = "";

  
  agricultureData.forEach(item => {
    htmlContent_agro_prod += `
      <div class="grid-element btn-menu rel js-btn-c-menu">
        <div class="icon-menu">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <span class="text-menu">PRODUCTION <br> ${item.name.toUpperCase().substring(0, 9)}..</span>
        <div class="c-menu" style="display: none">
          <div class="cm-el theme" id="${item.htmlID}">
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
  document.getElementById("agriculture").innerHTML += htmlContent_agro_prod;
  
  agricultureData.forEach(item => {
    // Génération du chargeur de couche
    window[`anal${item.name}_production`] = {
      nom: `Production ${item.name.toLowerCase()}`,
      htmlID: `#${item.htmlID}`,
      layerName: item.layerName,
      url: "http://srv558546.hstgr.cloud:8080/geoserver/agriculture/ows",
      layer: null,
      iconFunction: window[`${item.name.toLowerCase()}Icon`] || function({color = 'green'}) {
        return L.divIcon({
          className: 'custom-div-icon',
          html: `<i class='fa-solid ${item.icon}' style='font-size: 25px; color: ${color};'></i>`,
          iconSize: [25, 25],
          iconAnchor: [0, 0]
        });
      },
      color: generateRandomLightRGBA(),
      defaultProp: 'prod2023',
    };
  
    // Ajout de l'écouteur d'événement
    $(`#${item.htmlID}`).on("click", function () {
      UpdateBoundsLayerAnalysis({ Couche: window[`anal${item.name}_production`] });
    });
  });
  