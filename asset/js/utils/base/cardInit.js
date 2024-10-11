/**  CE FICHIER REGROUPE TOUTES LES FONCTIONS EN LIEN AVEC L'INITIALISATION DE LA CARTE */

// Fonction pour capitaliser la première lettre d'un mot (optionnel)
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generatePopupContent(properties) {
  let content = '<div class="popup"><p>';

  // Traiter la propriété 'nom' en premier s'il existe
  if (properties.nom) {
    content += `<strong style="color:green;text-transform:uppercase;">${properties.nom}</strong><br>`;
  }

  for (let key in properties) {
    if (properties.hasOwnProperty(key)) {
      // Exclure les clés indésirables (celles qui commencent par 'fit' ou sont 'forme')
      if (key.startsWith("fit") || key === "forme" || key === "nom") {
        continue;
      }

      let value = properties[key];

      if (value !== null && value !== undefined && value !== "") {
        content += `<strong>${capitalizeFirstLetter(
          key
        )} :</strong> ${value}<br>`;
      }
    }
  }

  content += "</p></div>";
  return content;
}

/** CEETE FONCTION AJOUTE LE SET DE POINTS GEOJSON A LA CARTE */

/**
 * Cette fonction permet d'ajouter des entités à une carte Leaflet à partir de données GeoJSON ou de GeoServer.
 * Un paramètre booléen `fromGeoServer` détermine la source des données.
 * Si `fromGeoServer` est vrai, il faut spécifier le `layer` et le `url` pour le chargement des données.
 *
 * @param {Object} pointsGoJson - Les données GeoJSON ou des options pour charger depuis GeoServer.
 * @param {L.Map} TheMap - La carte Leaflet sur laquelle ajouter les entités.
 * @param {boolean} fromGeoServer - Indique si les données proviennent de GeoServer (false par défaut).
 * @param {string} layer - Le nom du layer à charger depuis GeoServer (nécessaire si fromGeoServer est true).
 * @param {string} url - L'URL de la source GeoServer (nécessaire si fromGeoServer est true).
 * @param {string} color - Couleur pour les lignes et les contours des polygones (par défaut: '#3388ff').
 * @param {string} fillColor - Couleur de remplissage pour les polygones (par défaut: '#3388ff').
 * @returns {L.GeoJSON | L.TileLayer} - Un objet représentant les entités ajoutées à la carte.
 */
function AddPoints({
  pointsGoJson,
  TheMap,
  color = "#3388ff",
  fillColor = "#3388ff",
  fromGeoServer = false,
  layer = "",
  url = "",
  opacity = 0.7,
}) {
  if (fromGeoServer) {
    // Ajouter une couche WMS à la carte depuis GeoServer
    var geoServerLayer = L.tileLayer.wms(url, {
      layers: layer,
      format: "image/png",
      transparent: true,
      attribution: "GeoServer",
      opacity: opacity,
    });

    geoServerLayer.on("tileerror", function (error, tile) {
      console.error("Erreur lors du chargement de la tuile WMS : ", error);
      console.log(error);
    });

    //geoServerLayer.addTo(TheMap);
    console.log("Couche GeoServer ajoutée avec succès : " + layer);
    return geoServerLayer;
  } else {
    // Charger les données GeoJSON des points, lignes et polygones
    var Points = L.geoJSON(pointsGoJson, {
      style: function (feature) {
        // Appliquer un style seulement aux lignes (LineString) et polygones (Polygon, MultiPolygon)
        if (feature.geometry.type === "LineString") {
          return {
            color: color,
            weight: 4,
            opacity: 0.8,
          };
        }
        if (
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          return {
            color: color,
            weight: 2,
            fillColor: fillColor,
            fillOpacity: 0.4,
          };
        }
      },
      pointToLayer: function (feature, latlng) {
        // Si c'est un point, utiliser un circleMarker
        if (feature.geometry.type === "Point") {
          return L.circleMarker(latlng, {
            radius: 5,
            color: color,
            fillColor: fillColor,
            weight: 1,
            fillOpacity: 0.7,
          }).bindPopup(
            " <div class='pop'><p class='title'> Nom : " +
              feature.properties.name +
              "</p> " +
              " <p>OSM ID: " +
              feature.properties.osm_id +
              "</p> " +
              " <p>COO: " +
              feature.geometry.coordinates +
              "</p></div> "
          );
        }
      },
      onEachFeature: function (feature, layer) {
        // Gérer les événements pour chaque entité
        if (feature.geometry.type === "LineString") {
          layer.bindPopup(
            " <div class='pop'><p class='title'> Nom : " +
              (feature.properties.name || "Nom inconnu") +
              "</p> " +
              " <p>OSM ID: " +
              feature.properties.osm_id +
              "</p></div> "
          );

          layer.on("mouseover", function (e) {
            this.openPopup();
          });

          layer.on("mouseout", function (e) {
            this.closePopup();
          });
        }

        if (
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          layer.bindPopup(
            " <div class='pop'><p class='title'> Nom : " +
              (feature.properties.name || "Nom inconnu") +
              "</p> " +
              " <p>OSM ID: " +
              feature.properties.osm_id +
              "</p></div> "
          );

          layer.on("mouseover", function (e) {
            this.openPopup();
          });

          layer.on("mouseout", function (e) {
            this.closePopup();
          });
        }
      },
    });

    // Ajouter les points, lignes et polygones sur la carte
    //Points.addTo(TheMap);
    return Points;
  }
}

/**
 * Cette fonction permet d'ajouter des entités à une carte Leaflet à partir de données GeoJSON ou de GeoServer.
 * Un paramètre booléen `fromGeoServer` détermine la source des données.
 * Si `fromGeoServer` est vrai, il faut spécifier le `layer` et le `url` pour le chargement des données via WFS.
 *
 * @param {Object} pointsGoJson - Les données GeoJSON ou des options pour charger depuis GeoServer.
 * @param {L.Map} TheMap - La carte Leaflet sur laquelle ajouter les entités.
 * @param {boolean} fromGeoServer - Indique si les données proviennent de GeoServer (false par défaut).
 * @param {string} layer - Le nom du layer à charger depuis GeoServer (nécessaire si fromGeoServer est true).
 * @param {string} url - L'URL de la source GeoServer (nécessaire si fromGeoServer est true).
 * @param {string} color - Couleur pour les lignes et les contours des polygones (par défaut: '#3388ff').
 * @param {string} fillColor - Couleur de remplissage pour les polygones (par défaut: '#3388ff').
 * @param {number} opacity - Opacité des couches (par défaut: 0.7).
 * @returns {L.GeoJSON | L.TileLayer} - Un objet représentant les entités ajoutées à la carte.
 */
async function AddPointsWFS({
  pointsGoJson,
  TheMap,
  color = "#3388ff",
  fillColor = "#3388ff",
  fromGeoServer = false,
  layer = "",
  url = "",
  opacity = 0.7,
  icon = null,
}) {
  if (fromGeoServer) {
    var geojson = {};
    const loader = document.getElementById("loader");
    try {
      // URL WFS pour obtenir les données en GeoJSON
      const wfsUrl = `${url}?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer}&outputFormat=application/json`;

      // Récupérer les données GeoJSON de GeoServer
      try {
        // Affiche le loader avant le début du fetch
        loader.classList.remove("hidden");
        loading = true;
        const response = await fetch(wfsUrl);
        if (!response.ok) {
          console.error(
            "Erreur de réponse : ",
            response.status,
            response.statusText
          );
          // Masque le loader une fois le fetch terminé
          loader.classList.add("hidden");
          console.error("Aucune donnée GeoJSON disponible.");
          notis.create(
            "Error",
            "Une Erreur est survenue lors du chargement !",
            4
          );
          loader.classList.add("hidden");
          loading = false;
          return;
        }
        geojson = await response.json();
        //console.log('REPONSE DU SERVEUR ', geojson);
        // Masque le loader une fois le fetch terminé
        loader.classList.add("hidden");
        loading = false;

        if (!geojson.features || geojson.features.length === 0) {
          console.error("Aucune donnée GeoJSON disponible.");
          notis.create("Error", "Aucune donnée GeoJSON disponible.", 4);
          loader.classList.add("hidden");
          loading = false;
          return;
        }

        // var geoServerLayer = L.geoJSON(geojson, {
        //   // Ajoute ici tes styles
        // });

        //geoServerLayer.addTo(TheMap);
        //console.log("Données GeoServer ajoutées avec succès.", geoServerLayer);
        //return geoServerLayer;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données GeoServer : ",
          error
        );
        notis.create(
          "Error",
          "Une Erreur est survenue lors du chargement !",
          4
        );
        loader.classList.add("hidden");
        loading = false;
        return;
      }

      //const geojson = await response.json();
      //console.log('REPONSE DU SERVEUR ',geojson);
      // Ajouter les données GeoJSON à la carte en stylant les entités
      var markers = L.markerClusterGroup();
      var geoServerLayer = L.geoJSON(geojson, {
        style: function (feature) {
          if (feature.geometry.type === "LineString") {
            return {
              color: color,
              weight: 4,
              opacity: opacity,
            };
          }
          if (
            feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon"
          ) {
            return {
              color: color,
              weight: 2,
              fillColor: fillColor,
              fillOpacity: opacity,
            };
          }
        },
        pointToLayer: function (feature, latlng) {
          if (feature.geometry.type === "Point") {
            // Condition pour utiliser un circleMarker ou un marker classique
            var marker;
            if (icon == null) {
              marker = L.circleMarker(latlng, {
                radius: 5,
                color: color,
                fillColor: fillColor,
                weight: 1,
                fillOpacity: opacity,
              }).bindPopup(generatePopupContent(feature.properties));
            } else {
              marker = L.marker(latlng, {
                icon: icon,
              }).bindPopup(generatePopupContent(feature.properties));
            }

            // Ajouter le marqueur au groupe de clusters
            markers.addLayer(marker);

            return marker;
          }
        },
        onEachFeature: function (feature, layer) {
          if (
            feature.geometry.type === "LineString" ||
            feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon"
          ) {
            layer.bindPopup(generatePopupContent(feature.properties));

            layer.on("click", function (e) {
              this.openPopup();
            });
            // Clic droit pour afficher le menu contextuel
            layer.on("contextmenu", function (event) {
              currentLayer = layer; // Associer le polygone au menu contextuel
              showContextMenu(event.originalEvent); // Afficher le menu contextuel
            });

            layer.on("dbclick", function (e) {
              // Zoomer sur le polygone
              var bounds = this.getBounds(); // Obtient les limites du polygone
              TheMap.fitBounds(bounds, { padding: [20, 20] }); // Ajuste la carte pour inclure complètement le polygone
            });
          } else {
            layer.on("dblclick", function (e) {
              // Centrer et zoomer sur le point (tu peux définir un niveau de zoom, ici 14 par exemple)
              map.setView(e.latlng, 14);
            });
            // Clic droit pour afficher le menu contextuel
            layer.on("contextmenu", function (event) {
              currentLayer = layer; // Associer le polygone au menu contextuel
              showContextMenu(event.originalEvent); // Afficher le menu contextuel
            });
          }
        },
      });

      //geoServerLayer.addTo(TheMap);
      // Récupérer le type de géométrie de la première feature
      const firstFeature = geoServerLayer.getLayers()[0];
      const geometryType = firstFeature.feature.geometry.type;
      console.log("Données GeoServer ajoutées avec succès.", layer);
      console.log("Geometrie des donnees chargees : ", geometryType);
      if (geometryType == "Point" && icon != null) {
        return markers;
      }
      return geoServerLayer;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données GeoServer : ",
        error
      );

      notis.create("Error", "Une Erreur est survenue lors du chargement !", 4);
      loader.classList.add("hidden");
      loading = false;
    }
  } else {
    // Charger les données GeoJSON des points, lignes et polygones
    var Points = L.geoJSON(pointsGoJson, {
      style: function (feature) {
        if (feature.geometry.type === "LineString") {
          return {
            color: color,
            weight: 4,
            opacity: opacity,
          };
        }
        if (
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          return {
            color: color,
            weight: 2,
            fillColor: fillColor,
            fillOpacity: opacity,
          };
        }
      },
      pointToLayer: function (feature, latlng) {
        if (feature.geometry.type === "Point") {
          return L.circleMarker(latlng, {
            radius: 5,
            color: color,
            fillColor: fillColor,
            weight: 1,
            fillOpacity: opacity,
          }).bindPopup(generatePopupContent(feature.properties));
        }
      },
      onEachFeature: function (feature, layer) {
        if (
          feature.geometry.type === "LineString" ||
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          layer.bindPopup(generatePopupContent(feature.properties));

          layer.on("mouseover", function (e) {
            this.openPopup();
          });

          layer.on("mouseout", function (e) {
            this.closePopup();
          });
        }
      },
    });

    //Points.addTo(TheMap);
    return Points;
  }
}
