/*
L'OBJECTIF DE CE FIHCHIER EST DE CHARGER LES DIFFERENTES DATAS GEO , IL DOIT ETRE JUSTE APRES LE FICHIER MAP.JS CAR IL DEPEND DE L'INITALISATION DE LA CARTE

UNE FOIS LES DATAS CHARGES ON AJOUTE LES OPTIONS DE DESSIN ET AUTRES

*/

/** INITIALISATION DES CONTANTES */

const EDUCATIONAL_POINTS = PointsEducatifs;
const HEATH_CENTERS=hopitaux;
const WATER_POINTS=CourtEau;

/** INITIALISATION DES CONTANTES */

async function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

/* CREATION DU LAYERGROUP */
// par defaut on masquera les layers pour que le chargement soit plus rapide
var layerGroup = L.layerGroup([]);
var layerBoundsGroup=L.layerGroup([]); // un layergroup qui est different du precedent par ils ne s'agiut pas de points mais d'unite administratives
var layerList=[]   //UNE LISTE DE CHAINES QUI DONNES LES LABELS DES DIFFEENTS LAYERS





/* CENTRE */
var departements=null;
var arrondissements=null;
var communes=null;

/* CENTRE */




/* EDUCATION */

var superieur=null;
var secondaire=null;
var primaire= null;


/* EDUCATION */




/* LAYERSGROUP */

layerGroup.addTo(map);    
layerBoundsGroup.addTo(map); 



// Fonction pour ajouter une chaîne à la liste
function addToLayerList(chaine) {
  layerList.unshift(chaine);
  console.log("Élément ajouté :", chaine);
  console.log('layers presents', layerList);
  updateLegend(layerGroup);

}

// Fonction pour supprimer une chaîne de la liste
function dropFromLayerList(chaine) {
  const index = layerList.indexOf(chaine);
  if (index !== -1) {
    layerList.splice(index, 1);
    console.log("Élément supprimé :", chaine);
    console.log('layers presents', layerList);
    updateLegend(layerGroup);
  } else {
    console.log("Élément non trouvé :", chaine);
  }
}



/* LAYERSGROUP */





initCenter =function () {
  if (departements != null && layerBoundsGroup.hasLayer(departements)) {
    layerBoundsGroup.removeLayer(departements);
  } else {
    if (departements == null) {
      (async function () {
        var color = await getRandomColor();
        departements = await AddPointsWFS({
          fromGeoServer: true,
          TheMap: map,
          layer: "centre:departements",
          url: "http://srv558546.hstgr.cloud:8080/geoserver/centre/wms",
          opacity: 0.5,
          fillColor: color,
          color: color,
        });

        // Ajouter le layer au layerBoundsGroup
        layerBoundsGroup.addLayer(departements);
      })();
    } else {
      layerBoundsGroup.addLayer(departements);
    }
  }
}














/* LEGENDE  */


// Initialisation du contrôle pour la légende
var legendControl = L.control({ position: 'topright' });

// Fonction pour générer la légende
legendControl.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = `
    <div class="legend-toggle"></div>
    <div class="legend-content">
      <h4 class="legend-title">Légende <i class="fa-solid fa-earth-africa"></i> </h4>
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

// Fonction pour mettre à jour la légende en fonction des layers présents
function updateLegend(layerGroup) {
  // console.log('legende mise a jour ...');
  var legendDiv = document.querySelector('.legend');
  legendDiv.innerHTML = '<h4> <span><i class=\'fa-solid fa-earth-africa\'></i> Légende</span></h4>';  // Réinitialiser le contenu
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


























// ########### OPTIONS DE DESSIN ############################ //

var drawnItems= InitDraw(TheMap=map);
NewCountEntytiesInZone(GeoPointsDatasList=layerGroup.getLayers() , drawnItems=drawnItems , labels=layerList,TheMap=map)

// Initialiser la barre de recherche pour la recherche de pointsd chargees dans le layergroup  juste

setupSearch(geoJsonLayers=layerGroup.getLayers(), TheMap=map);