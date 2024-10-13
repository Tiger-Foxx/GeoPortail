function calculateQuantiles(data, property, numQuantiles = 10) {
    const values = data.features.map(feature => feature.properties[property]).filter(v => v != null);
    values.sort((a, b) => a - b);
  
    // Calculer les quantiles
    const quantiles = [];
    for (let i = 1; i <= numQuantiles; i++) {
      const quantileIndex = Math.floor(i * values.length / numQuantiles) - 1;
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
  



async function  UpdateBoundsLayerAnalysis(Couche) {
    if (!loading) {
      //document.getElementById(Couche.htmlID).classList.toggle("open");
       $(Couche.htmlID).toggleClass("open");
      if (Couche.layer != null && layerBoundsGroup.hasLayer(Couche.layer)) {
        layerBoundsGroup.removeLayer(Couche.layer);
        isThematicMode=false;
        //L.DomUtil.remove(divLegendAnalysis)
        divLegendAnalysis.classList.add('hidden');
        //document.removeChild(divLegendAnalysis);
      } else {
        if (Couche.layer == null) {
          (async function () {
            var color = await getRandomColor();
            Couche.layer = await AddPointsWFSAnalysis({
              fromGeoServer: true,
              TheMap: map,
              propertyToAnalyze: "consul2023",
                colorScaleFunction: generateColorScale,
              layer: Couche.layerName,
              url: Couche.url,
              opacity: 0.8,
              //fillColor: color,
              color: color,
              showLabel: true,
              maxValue: 150000, // Supposons que la valeur maximale soit 150000
              titre:Couche.nom,

            });
  
            Couche.layer.nom=Couche.nom;
    
            // Ajouter le layer au layerBoundsGroup
            layerBoundsGroup.addLayer(Couche.layer);
          })();
        } else {
          layerBoundsGroup.addLayer(Couche.layer);
          divLegendAnalysis.classList.remove('hidden');
        }
        isThematicMode=true;
      }
    }else{
     notis.create("Attention", "Une couche est dejà en cours de chargement ....", 4);
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
    titre='Legende',
  }) {
    let legend;
  
    if (fromGeoServer) {
      var geojson = {};
      const loader = document.getElementById("loader");
  
      try {
        const wfsUrl = `${url}?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer}&outputFormat=application/json`;
  
        loader.classList.remove("hidden");
        const response = await fetch(wfsUrl);
        if (!response.ok) {
          console.error("Erreur lors de la récupération des données GeoJSON.");
          loader.classList.add("hidden");
          return;
        }
        geojson = await response.json();
        loader.classList.add("hidden");
  
        if (!geojson.features || geojson.features.length === 0) {
          console.error("Aucune donnée GeoJSON disponible.");
          return;
        }
  
        // Calculer les quantiles basés sur la propriété d'analyse
        const quantiles = calculateQuantiles(geojson, propertyToAnalyze, 10);
  
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
              layer.bindPopup(generatePopupContent(feature.properties));
              this.openPopup();
            });
  
            // Affichage du label si activé
            if (showLabel) {
              const labelText = feature.properties.division || "Sans nom";
              layer.bindTooltip(labelText, {
                permanent: true,
                direction: "center",
                className: "label-class",
              }).openTooltip();
            }
          },
        });
  
        geoServerLayer.addTo(TheMap);
        console.log("Données GeoServer analysées et ajoutées avec succès.");
  
        // Ajouter la légende à la carte après chargement des données
        if (legend) {
          TheMap.removeControl(legend); // Retirer la légende précédente s'il y en avait une
        }
        legend = createLegend( {quantiles: quantiles, baseColor: baseColor,titre:titre});
        legend.addTo(TheMap); // Ajouter la nouvelle légende
  
        return geoServerLayer;
      } catch (error) {
        console.error("Erreur lors de la récupération des données GeoServer :", error);
        loader.classList.add("hidden");
      }
    }
  }

var divLegendAnalysis=null;
  function createLegend({quantiles, baseColor,titre='Legende'}) {
    const legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function (map) {
       divLegendAnalysis = L.DomUtil.create('div', 'info-analysis legend-analysis');
      // Créer un nouvel élément div pour la sous-div
        var sousDiv = document.createElement('div');
        sousDiv.classList.add('titre-analysis');
       divLegendAnalysis.setAttribute('id', 'legend-analysis');

        var sousDiv2 = document.createElement('div');

        // Créer un nouvel élément h4 et lui donner du texte
        const h4 = document.createElement('h4');
        h4.textContent = titre;

        // Ajouter l'élément h4 à la sous-div
        sousDiv.appendChild(h4);
        divLegendAnalysis.appendChild(sousDiv);
  
      const labels = [];
  
      // Boucle sur les quantiles et ajout des plages de valeurs et des couleurs correspondantes
      for (let i = 0; i < quantiles.length; i++) {
        const color = darkenColor(baseColor, i / (quantiles.length - 1)); // Modulation de la couleur
        labels.push(
          `<div class="legend-item">
            <i style="background:${color}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> 
            ${quantiles[i - 1] ? `${quantiles[i - 1].toFixed(2)} - ${quantiles[i].toFixed(2)}` : `Min - ${quantiles[i].toFixed(2)}`}
          </div>`
        );
      }
  
      sousDiv2.innerHTML = labels.join('');
      divLegendAnalysis.appendChild(sousDiv2);
  
      return divLegendAnalysis;
    };
  
    return legend;
  }
  
  