


/* LEGENDE  */


// Initialisation du contrôle pour la légende
var legendControl = L.control({ position: 'topright' });

// Fonction pour générer la légende
legendControl.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend open');
  div.innerHTML = `
    <div class="legend-toggle"></div>
    <div class="legend-content">
      <div class="legend-pad"></div>
      
    </div>
  `;
   // Ajouter un événement "click" pour réduire/agrandir la légende
   div.addEventListener("click", function () {
    div.classList.toggle('open'); // Ajoute ou retire la classe 'open' qui contrôle la hauteur
  });
  return div;
};

// Ajouter la légende à la carte
legendControl.addTo(map);
// deplacement de l'element legende
var htmlLegend = legendControl.getContainer();
var containerLegend = document.getElementById("legende");
containerLegend.appendChild(htmlLegend);

// Fonction pour mettre à jour la légende en fonction des layers présents
function updateLegend(layerGroup) {
  // console.log('legende mise a jour ...');
  var legendDiv = document.querySelector('.legend');
  legendDiv.innerHTML = '';  // Réinitialiser le contenu
  var i=0;  

  layerGroup.eachLayer(function (layer) {
    var firstFeature=layer.getLayers()[0];
    var geometryType = firstFeature.feature.geometry.type;
   // console.log('verification ... ',firstFeature.options);
    if (geometryType=='Point'  && firstFeature.options.icon) {
      
      console.log('legende mise a jour ... ');
      // Récupérer l'icône et la couleur du layer
      var iconHtml = firstFeature.options.icon.options.html;
      var layerName = layer.nom  ? layer.nom : (layerList[i])?layerList[i]+' from list': "Layer sans nom";
      
      // Ajouter l'entrée à la légende
      legendDiv.innerHTML += `
        <div class="legend-item">
          ${iconHtml} ${layerName}
        </div>
      `;
    }
    i++;
  });
}

updateLegend(layerGroup);


/* LEGENDE  */
