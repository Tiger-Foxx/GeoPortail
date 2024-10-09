/**  CE FICHIER REGROUPE TOUTES LES FONCTIONS EN LIEN AVEC L'INITIALISATION DE LA CARTE */

/** CEETE FONCTION AJOUTE LE SET DE POINTS GEOJSON A LA CARTE */

function AddPointsOld(
  pointsGoJson,
  TheMap,
  color = "#3388ff",
  fillColor = "#3388ff"
) {
  // Charger les données GeoJSON des points éducatifs
  var Points = L.geoJSON(pointsGoJson, {
    pointToLayer: function (feature, latlng) {
      // Utiliser des points circulaires (circleMarker) au lieu de markers pour améliorer les performances
      return L.circleMarker(latlng, {
        radius: 5, // Taille du point
        color: color, // Couleur du contour du cercle
        fillColor: fillColor, // Couleur de remplissage

        weight: 1, // Épaisseur du contour
        fillOpacity: 0.7, // Opacité du remplissage
      }).bindPopup(
        " <div class='pop'><p class='title'> Nom : " +
          feature.properties.name +
          "</p> " +
          " <p>OSM ID" +
          feature.properties.osm_id +
          "</p> " +
          " <p>COO: " +
          feature.geometry.coordinates +
          "</p></div> "
      ); // Popup avec le nom de l'école
    },
  });

  return Points;
}

function AddPointsOld2(
  pointsGoJson,
  TheMap,
  color = "#3388ff",
  fillColor = "#3388ff"
) {
  // Charger les données GeoJSON des points, lignes et polygones
  var Points = L.geoJSON(pointsGoJson, {
    style: function (feature) {
      // Appliquer un style seulement aux lignes (LineString) et polygones (Polygon, MultiPolygon)
      if (feature.geometry.type === "LineString") {
        return {
          color: color, // Couleur de la ligne
          weight: 4, // Épaisseur de la ligne
          opacity: 0.8, // Opacité de la ligne
        };
      }
      // Style pour les polygones
      if (
        feature.geometry.type === "Polygon" ||
        feature.geometry.type === "MultiPolygon"
      ) {
        return {
          color: color, // Couleur du contour
          weight: 2, // Épaisseur du contour
          fillColor: fillColor, // Couleur de remplissage
          fillOpacity: 0.4, // Opacité du remplissage
        };
      }
    },
    pointToLayer: function (feature, latlng) {
      // Si c'est un point, utiliser un circleMarker
      if (feature.geometry.type === "Point") {
        return L.circleMarker(latlng, {
          radius: 5, // Taille du point
          color: color, // Couleur du contour du cercle
          fillColor: fillColor, // Couleur de remplissage
          weight: 1, // Épaisseur du contour
          fillOpacity: 0.7, // Opacité du remplissage
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
        // Ajouter un popup pour les lignes
        layer.bindPopup(
          " <div class='pop'><p class='title'> Nom : " +
            (feature.properties.name || "Nom inconnu") +
            "</p> " +
            " <p>OSM ID: " +
            feature.properties.osm_id +
            "</p></div> "
        );

        // Afficher le popup lors du survol de la ligne
        layer.on("mouseover", function (e) {
          this.openPopup();
        });

        // Fermer le popup lorsque la souris quitte la ligne
        layer.on("mouseout", function (e) {
          this.closePopup();
        });
      }

      // Ajouter un popup pour les polygones
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

        // Survol du polygone
        layer.on("mouseover", function (e) {
          this.openPopup();
        });

        // Quitter le polygone
        layer.on("mouseout", function (e) {
          this.closePopup();
        });
      }
    },
  });

  // Ajouter les points, lignes et polygones sur la carte
  // Points.addTo(TheMap);

  return Points;
}

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
    const loader = document.getElementById('loader');
    try {
      // URL WFS pour obtenir les données en GeoJSON
      const wfsUrl = `${url}?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer}&outputFormat=application/json`;

      // Récupérer les données GeoJSON de GeoServer
      try {
        // Affiche le loader avant le début du fetch
        loader.classList.remove('hidden');
        const response = await fetch(wfsUrl);
        if (!response.ok) {
          console.error(
            "Erreur de réponse : ",
            response.status,
            response.statusText
          );
          // Masque le loader une fois le fetch terminé
          loader.classList.add('hidden');
          return;
        }
        geojson = await response.json();
        //console.log('REPONSE DU SERVEUR ', geojson);
        // Masque le loader une fois le fetch terminé
        loader.classList.add('hidden');

        if (!geojson.features || geojson.features.length === 0) {
          console.error("Aucune donnée GeoJSON disponible.");
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
              }).bindPopup(`
                <div class="popup">
                  <h2>Informations sur le lieu</h2>
                  <p>
                    <strong>Nom :</strong> ${feature.properties.nom || "Nom inconnu"}<br>
                    <strong>Identifiant :</strong> ${feature.properties.id}<br>
                    <strong>Coordonnées :</strong> ${feature.geometry.coordinates}<br>
                    <strong>Département :</strong> ${feature.properties.departement || "Nom inconnu"}<br>
                    <strong>Catégorie :</strong> ${feature.properties.categorie || "inconnue"}
                  </p>
                </div>
              `);
            } else {
              marker = L.marker(latlng, {
                icon: icon,
              }).bindPopup(`
                <div class="popup">
                  <h2>Informations sur le lieu</h2>
                  <p>
                    <strong>Nom :</strong> ${feature.properties.nom || "Nom inconnu"}<br>
                    <strong>Identifiant :</strong> ${feature.properties.id}<br>
                    <strong>Coordonnées :</strong> ${feature.geometry.coordinates}<br>
                    <strong>Département :</strong> ${feature.properties.departement || "Nom inconnu"}<br>
                    <strong>Catégorie :</strong> ${feature.properties.categorie || "inconnue"}
                  </p>
                </div>
              `);
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
            layer.bindPopup(
              `
                <div class="pop">
                  <p class="title">Nom : ${
                    feature.properties.nom ||
                    feature.properties.departement ||
                    "Nom inconnu"
                  }</p>
                  <p>ID: ${feature.properties.id}</p>
                </div>
              `
            );

            layer.on("click", function (e) {
              this.openPopup();
            });

            layer.on("mouseout", function (e) {
              this.closePopup();
            });
          }
        },
      });

      //geoServerLayer.addTo(TheMap);
      // Récupérer le type de géométrie de la première feature
      const firstFeature = geoServerLayer.getLayers()[0];
      const geometryType = firstFeature.feature.geometry.type;
      console.log("Données GeoServer ajoutées avec succès.", layer);
      console.log('Geometrie des donnees chargees : ',geometryType)
      if (geometryType=='Point' && icon != null) {
        return markers;
      }
      return geoServerLayer;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données GeoServer : ",
        error
      );
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
          }).bindPopup(
            "<div class='pop'><p class='title'> Nom : " +
              feature.properties.nom +
              "</p> <p>OSM ID: " +
              feature.properties.osm_id +
              "</p> <p>COO: " +
              feature.geometry.coordinates +
              "</p></div>"
          );
        }
      },
      onEachFeature: function (feature, layer) {
        if (
          feature.geometry.type === "LineString" ||
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          layer.bindPopup(
            "<div class='pop'><p class='title'> Nom : " +
              feature.properties.nom +
              "</p> <p>OSM ID: " +
              feature.properties.osm_id +
              "</p></div>"
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
async function AddPointsWFS2({
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
    try {
      // URL WFS pour obtenir les données en GeoJSON
      const wfsUrl = `${url}?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer}&outputFormat=application/json`;

      // Récupérer les données GeoJSON de GeoServer
      const response = await fetch(wfsUrl);
      const geojson = await response.json();

      // Ajouter les données GeoJSON à la carte en stylant les entités
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
            return L.circleMarker(latlng, {
              radius: 5,
              color: color,
              fillColor: fillColor,
              weight: 1,
              fillOpacity: opacity,
            }).bindPopup(
              "<div class='pop'><p class='title'> Nom : " +
                (feature.properties.name || "Nom inconnu") +
                "</p> <p>OSM ID: " +
                feature.properties.osm_id +
                "</p> <p>COO: " +
                feature.geometry.coordinates +
                "</p></div>"
            );
          }
        },
        onEachFeature: function (feature, layer) {
          if (
            feature.geometry.type === "LineString" ||
            feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon"
          ) {
            layer.bindPopup(
              "<div class='pop'><p class='title'> Nom : " +
                (feature.properties.name || "Nom inconnu") +
                "</p> <p>OSM ID: " +
                feature.properties.osm_id +
                "</p></div>"
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

      //geoServerLayer.addTo(TheMap);
      console.log("Données GeoServer ajoutées avec succès.");
      return geoServerLayer;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données GeoServer : ",
        error
      );
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
          }).bindPopup(
            "<div class='pop'><p class='title'> Nom : " +
              feature.properties.name +
              "</p> <p>OSM ID: " +
              feature.properties.osm_id +
              "</p> <p>COO: " +
              feature.geometry.coordinates +
              "</p></div>"
          );
        }
      },
      onEachFeature: function (feature, layer) {
        if (
          feature.geometry.type === "LineString" ||
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          layer.bindPopup(
            "<div class='pop'><p class='title'> Nom : " +
              feature.properties.name +
              "</p> <p>OSM ID: " +
              feature.properties.osm_id +
              "</p></div>"
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

    //Points.addTo(TheMap);
    return Points;
  }
}
