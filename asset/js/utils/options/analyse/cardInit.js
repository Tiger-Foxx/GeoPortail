let currentColor = null;
let currentGeoJson = null;
let legend = null;
let nomCurrentLayer = null;
let nQuantiles=5;
function calculateQuantiles(data, property, numQuantiles = 5) {
  const values = data.features
    .map((feature) => feature.properties[property])
    .filter((v) => v != null);
  values.sort((a, b) => a - b);

  // Calculer les quantiles
  const quantiles = [];
  for (let i = 1; i <= numQuantiles; i++) {
    const quantileIndex = Math.floor((i * values.length) / numQuantiles) - 1;
    quantiles.push(values[quantileIndex]);
  }
  return quantiles;
}

function darkenColor(rgba, factor) {
  // rgba est un tuple [r, g, b, a] par exemple [255, 0, 0, 1] pour du rouge
  const [r, g, b, a] = rgba;

  // On réduit chaque composante R, G et B en fonction du facteur
  const darkenedR = Math.floor(r * (1 - factor));
  const darkenedG = Math.floor(g * (1 - factor));
  const darkenedB = Math.floor(b * (1 - factor));

  // Retourner la nouvelle couleur
  return `rgba(${darkenedR}, ${darkenedG}, ${darkenedB}, ${a})`;
}

function colorScaleWithQuantiles(value, quantiles, baseColor) {
  // Trouver dans quel quantile se situe la valeur
  for (let i = 0; i < quantiles.length; i++) {
    if (value <= quantiles[i]) {
      // Calculer un facteur pour assombrir la couleur
      const factor = i / (quantiles.length - 1); // entre 0 et 1
      return darkenColor(baseColor, factor); // Assombrir la couleur de base en fonction du quantile
    }
  }

  // Si la valeur dépasse tous les quantiles, retourner la couleur la plus sombre
  return darkenColor(baseColor, 1);
}

async function UpdateBoundsLayerAnalysis({
  Couche,
  propertyToAnalyze = null,
  test = false,
}) {
  if (!loading) {
    //document.getElementById(Couche.htmlID).classList.toggle("open");
    //$(Couche.htmlID).toggleClass("open");
    if (
      Couche.layer != null &&
      layerBoundsGroupAnalysis.hasLayer(Couche.layer)
    ) {
      console.log("on va supprimer.......");
      layerBoundsGroupAnalysis.removeLayer(Couche.layer);
      $(Couche.htmlID).toggleClass("open");
      toggleAnlyseMode();
      //L.DomUtil.remove(divLegendAnalysis)
      divLegendAnalysis.classList.add("hidden");
      //document.removeChild(divLegendAnalysis);
    } else {
      if (Couche.layer == null) {
        (async function () {
          currentColor = Couche.color ? Couche.color : [0, 128, 255, 1];
          var color = await getRandomColor();
          console.log("on va ajouter.......");
          Couche.layer = null;
          Couche.layer = await AddPointsWFSAnalysis({
            test: test,
            fromGeoServer: true,
            TheMap: map,
            propertyToAnalyze: propertyToAnalyze || Couche.defaultProp ||"length",
            colorScaleFunction: generateColorScale,
            layer: Couche.layerName,
            url: Couche.url,
            opacity: 0.8,
            //fillColor: color,
            baseColor: Couche.color ? Couche.color : [0, 128, 255, 1],
            showLabel: true,
            maxValue: 150000, // Supposons que la valeur maximale soit 150000
            titre: propertyToAnalyze
              ? Couche.nom + `( ${propertyToAnalyze} )`
              : Couche.nom,
          });

          if (Couche.layer != null) {
            $(Couche.htmlID).toggleClass("open");
            Couche.layer.nom = Couche.nom;
            nomCurrentLayer = Couche.nom;
            layerBoundsGroupAnalysis.clearLayers();
          }

          // Ajouter le layer au layerBoundsGroup
          layerBoundsGroupAnalysis.addLayer(Couche.layer);
        })();
      } else {
        if (Couche.layer != null) {
          $(Couche.htmlID).toggleClass("open");
          layerBoundsGroupAnalysis.clearLayers();
        }
        layerBoundsGroupAnalysis.addLayer(Couche.layer);
      }
     
      if (!isThematicMode) {
        toggleAnlyseMode();
      }
    }
  } else {
    notis.create(
      "Attention",
      "Une couche est dejà en cours de chargement ....",
      4
    );
  }
}

// Fonction de génération d'échelle de couleur
function generateColorScale(value, maxValue, baseColor = [100, 150, 250, 0.8]) {
  // Segmentation en 10 parties
  const segmentCount = 10;
  const step = Math.min(value / maxValue, 1); // Normalisation de la valeur entre 0 et 1

  // Assombrissement de la couleur en fonction de la valeur
  let darkenFactor = Math.floor(step * segmentCount); // Nombre de segments à traverser
  darkenFactor = Math.min(darkenFactor, segmentCount - 1); // Ne pas dépasser le nombre de segments

  // Appliquer l'assombrissement à la couleur de base (en fonçant la couleur)
  const darkenedColor = baseColor.map((component, index) => {
    if (index < 3) {
      // Assombrir les valeurs RGB, ignorer l'alpha (baseColor[3])
      return Math.max(0, component - darkenFactor * 20); // Réduire chaque composant RGB
    }
    return component; // Alpha reste inchangé
  });

  // Convertir en format RGBA
  return `rgba(${darkenedColor[0]}, ${darkenedColor[1]}, ${darkenedColor[2]}, ${darkenedColor[3]})`;
}

async function AddPointsWFSAnalysis({
  pointsGeoJson,
  TheMap,
  propertyToAnalyze = "consul2023", // Propriété à analyser
  baseColor = [0, 128, 255, 1], // Couleur de base par défaut en RGBA (bleu clair ici)
  fromGeoServer = false,
  layer = "",
  url = "",
  opacity = 0.7,
  showLabel = false,
  titre = "Legende",
  test = false,
}) {
  if (fromGeoServer) {
    var geojson = {};
    const loader = document.getElementById("loader");

    try {
      const timestamp = new Date().getTime(); // Crée un timestamp unique

      const wfsUrl = `${url}?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer}&outputFormat=application/json&_=${timestamp}`;

      loader.classList.remove("hidden");
      const response = await fetch(wfsUrl, {
        method: "GET",
        redirect: "manual", // Désactive le suivi automatique des redirections
      });
      if (!response.ok) {
        console.error("Erreur lors de la récupération des données GeoJSON.");
        try {
          notis.create(
            "error",
            "Erreur lors de la récupération des données ...",
            4
          );
        } catch (error) {
          
        }
        loader.classList.add("hidden");
        return;
      }
      if (test) {
        var texte = await response.text();
        console.log("REPONSE BRUTE DU SERVEUR : ", texte);
      }

      geojson = await response.json();
      loader.classList.add("hidden");
      console.log("LES DATAS geojson :", geojson);

      if (!geojson.features || geojson.features.length === 0) {
        console.error("Aucune donnée GeoJSON disponible.");
        try {
          notis.create(
            "error",
            "Aucune donnée GeoJSON disponible ...",
            4
          );
        } catch (error) {
          
        }
        return;
      }

      // Calculer les quantiles basés sur la propriété d'analyse
      const quantiles = calculateQuantiles(geojson, propertyToAnalyze, nQuantiles);

      // Initialisation des calques Leaflet
      var geoServerLayer = L.geoJSON(geojson, {
        style: function (feature) {
          const value = feature.properties[propertyToAnalyze] || 0;
          const fillColor = colorScaleWithQuantiles(
            value,
            quantiles,
            baseColor
          );
          return {
            color: "#000", // Bordure noire
            weight: 1,
            fillColor: fillColor, // Couleur thématique modifiée en fonction des quantiles
            fillOpacity: opacity,
          };
        },
        onEachFeature: function (feature, layer) {
          layer.on("click", function (e) {
            if (isInfo) {
              layer.bindPopup(generatePopupContent(feature.properties));
              this.openPopup();
            } else {
              // e.preventDefault();
              try {
                layer.unbindPopup();
              } catch (error) {}

              // console.log('aucun popUp')
            }
          });
          // Clic droit pour afficher le menu contextuel
          layer.on("contextmenu", function (event) {
            currentLayer = layer; // Associer le polygone au menu contextuel
            currentGeoJson = geojson;
            showContextMenu(event.originalEvent); // Afficher le menu contextuel
          });

          // Affichage du label si activé
          if (showLabel) {
            const labelText = feature.properties.division || "Sans nom";
            layer
              .bindTooltip(labelText, {
                permanent: true,
                direction: "center",
                className: "label-class",
              })
              .openTooltip();
          }
        },
      });

      // geoServerLayer.addTo(TheMap);
      console.log("Données GeoServer analysées et ajoutées avec succès.");
      try {
        notis.create(
          "success",
          "Données GeoServer analysées et ajoutées avec succès.",
          4
        );
      } catch (error) {
        
      }

      // Ajouter la légende à la carte après chargement des données
      if (legend) {
        TheMap.removeControl(legend); // Retirer la légende précédente s'il y en avait une
      }
      legend = createLegend({
        quantiles: quantiles,
        baseColor: baseColor,
        titre: titre,
      });
      legend.addTo(TheMap); // Ajouter la nouvelle légende

      return geoServerLayer;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données GeoServer :",
        error
      );
      try {
        notis.create(
          "error",
          "Erreur lors de la récupération des données ...",
          4
        );
      } catch (error) {
        
      }
      
      //notis.create("Erreur lors de la récupération des données GeoServer", 4);
      loader.classList.add("hidden");
    }
  }
}

var divLegendAnalysis = null;
function createLegend({ quantiles, baseColor, titre = "Légende" }) {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    // Création du conteneur principal pour la légende
    const divLegendAnalysis = L.DomUtil.create(
      "div",
      "info-analysis legend-analysis"
    );
    divLegendAnalysis.setAttribute("id", "legend-analysis");

    // Création de la sous-div pour le titre
    const sousDiv = document.createElement("div");
    sousDiv.classList.add("titre-analysis");

    // Création du titre h4
    const h4 = document.createElement("h4");
    h4.textContent = titre;
    sousDiv.appendChild(h4);
    divLegendAnalysis.appendChild(sousDiv);

    // Liste des labels en fonction du nombre de quantiles
    const labelMap = {
      5: ["Très élevé", "Élevé", "Moyen", "Bas", "Très bas"],
      4: ["Très élevé", "Élevé", "Moyen", "Bas"],
      3: ["Élevé", "Moyen", "Bas"],
      2: ["Élevé", "Bas"],
      1: [], // Aucun label si un seul intervalle
    };

    // On choisit la bonne série de labels selon le nombre de quantiles
    const labels = labelMap[quantiles.length] || labelMap[5];
    const legendItems = [];

    // Boucle sur les quantiles pour créer les entrées de la légende
    for (let i = 0; i < quantiles.length; i++) {
      const color = darkenColor(baseColor, i / (quantiles.length - 1)); // Modulation de la couleur

      // Ajout du label et de la plage de valeurs
      const labelText = labels[i] || "";
      const rangeText = quantiles[i - 1]
        ? `${quantiles[i - 1].toFixed(2)} - ${quantiles[i].toFixed(2)}`
        : `Min - ${quantiles[i].toFixed(2)}`;

      // Création de l'élément HTML pour chaque item de la légende
      legendItems.push(
        `<div class="legend-item">
          <i style="background:${color}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> 
          ${labelText}: ${rangeText}
        </div>`
      );
    }

    // Ajout des items à la légende
    const sousDiv2 = document.createElement("div");
    sousDiv2.innerHTML = legendItems.join("");
    divLegendAnalysis.appendChild(sousDiv2);

    return divLegendAnalysis;
  };

  return legend;
}


function UpdateAnalysis({
  Currentgeojson,
  propertyToAnalyze,
  opacity = 0.8,
  TheMap = map,
  showLabel = true,
}) {
  let geojson = Currentgeojson;
  const baseColor = currentColor ? currentColor : [0, 128, 255, 1]; // Couleur de base en RGBA (bleu clair ici)
  // Calculer les quantiles basés sur la propriété d'analyse
  const quantiles = calculateQuantiles(geojson, propertyToAnalyze, nQuantiles);
  let nom = nomCurrentLayer;
  titre = nom + `( ${propertyToAnalyze} )`;

  // Initialisation des calques Leaflet
  var geoServerLayer = L.geoJSON(geojson, {
    style: function (feature) {
      const value = feature.properties[propertyToAnalyze] || 0;
      const fillColor = colorScaleWithQuantiles(value, quantiles, baseColor);
      return {
        color: "#000", // Bordure noire
        weight: 1,
        fillColor: fillColor, // Couleur thématique modifiée en fonction des quantiles
        fillOpacity: opacity,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.on("click", function (e) {
        if (isInfo) {
          layer.bindPopup(generatePopupContent(feature.properties));
          this.openPopup();
        } else {
          // e.preventDefault();
          try {
            layer.unbindPopup();
          } catch (error) {}

          // console.log('aucun popUp')
        }
      });
      // Clic droit pour afficher le menu contextuel
      layer.on("contextmenu", function (event) {
        currentLayer = layer; // Associer le polygone au menu contextuel
        currentGeoJson = geojson;
        showContextMenu(event.originalEvent); // Afficher le menu contextuel
      });

      // Affichage du label si activé
      if (showLabel) {
        const labelText = feature.properties.division || "Sans nom";
        layer
          .bindTooltip(labelText, {
            permanent: true,
            direction: "center",
            className: "label-class",
          })
          .openTooltip();
      }
    },
  });
  geoServerLayer.nom = nom;

  // geoServerLayer.addTo(TheMap);
  console.log("Données GeoServer analysées et ajoutées avec succès.");

  // Ajouter la légende à la carte après chargement des données
  if (legend) {
    TheMap.removeControl(legend); // Retirer la légende précédente s'il y en avait une
  }

  legend = createLegend({
    quantiles: quantiles,
    baseColor: baseColor,
    titre: titre,
  });
  legend.addTo(TheMap); // Ajouter la nouvelle légende

  layerBoundsGroupAnalysis.clearLayers();

  layerBoundsGroupAnalysis.addLayer(geoServerLayer);
  try {
    document.getElementById("btn-clear").classList.remove("hidden");
  } catch (e) {}
  return geoServerLayer;
}


function clearAnalysisLayer() {
  layerBoundsGroupAnalysis.clearLayers();
  try {
    document.getElementById("btn-clear").classList.add("hidden");
    // Sélectionner tous les éléments avec la classe "theme"
    const elements = document.querySelectorAll(".theme");

    // Parcourir chaque élément
    elements.forEach((element) => {
      // Vérifier si la classe "open" est présente et la supprimer si c'est le cas
      if (element.classList.contains("open")) {
        element.classList.remove("open");
      }
    });
    if (isThematicMode) {
      toggleAnlyseMode();
    }
    try {
      notis.create(
        "success",
        "Fin de l'analyse ...",
        4
      );
    } catch (error) {
      
    }
  } catch (e) {}
}

$('#btn-clear').on('click', function () {
  clearAnalysisLayer();
});
