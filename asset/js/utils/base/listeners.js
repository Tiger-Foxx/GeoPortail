/** CE FICHIER CONTIENT LES ECOUTEURS D'EVENEMENT A INITIALISER */


/* EDUCATION */

$("#primaire").on("click", function () {
  $(this).toggleClass("open");
  if (primaire != null && layerGroup.hasLayer(primaire)) {
    layerGroup.removeLayer(primaire);
    dropFromLayerList("Ecoles Primaires");
  } else {
    if (primaire == null) {
      (async function () {
        var color = await getRandomColor();
        primaire = await AddPointsWFS({
          fromGeoServer: true,
          TheMap: map,
          layer: "education:primaire",
          url: "http://srv558546.hstgr.cloud:8080/geoserver/education/ows",
          opacity: 0.6,
          fillColor: color,
          color: color,
          icon: primaireIcon({ color: color }),
        });
        primaire.nom="Ecoles Primaires";
        // Ajouter le layer au layerBoundsGroup
        layerGroup.addLayer(primaire);
        // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
        setupSearch((geoJsonLayers = layerGroup.getLayers()), (TheMap = map));
        NewCountEntytiesInZone(
          (GeoPointsDatasList = layerGroup.getLayers()),
          (drawnItems = drawnItems),
          (labels = layerList),
          (TheMap = map)
        );
        addToLayerList("Ecoles Primaires");
      })();
    } else {
      layerGroup.addLayer(primaire);
      // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
      setupSearch((geoJsonLayers = layerGroup.getLayers()), (TheMap = map));
      NewCountEntytiesInZone(
        (GeoPointsDatasList = layerGroup.getLayers()),
        (drawnItems = drawnItems),
        (labels = layerList),
        (TheMap = map)
      );
      addToLayerList("Ecoles Primaires");
    }
  }
});

$("#secondaire").on("click", function () {
  $(this).toggleClass("open");
  if (secondaire != null && layerGroup.hasLayer(secondaire)) {
    layerGroup.removeLayer(secondaire);
    dropFromLayerList("Ecoles secondaires");
  } else {
    if (secondaire == null) {
      (async function () {
        var color = await getRandomColor();
        secondaire = await AddPointsWFS({
          fromGeoServer: true,
          TheMap: map,
          layer: "education:secondaire",
          url: "http://srv558546.hstgr.cloud:8080/geoserver/education/ows",
          opacity: 0.6,
          fillColor: color,
          color: color,
          icon: secondaireIcon({ color: color }),
        });
        secondaire.nom="Ecoles secondaires";
        layerGroup.addLayer(secondaire);
        // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
        setupSearch((geoJsonLayers = layerGroup.getLayers()), (TheMap = map));
        NewCountEntytiesInZone(
          (GeoPointsDatasList = layerGroup.getLayers()),
          (drawnItems = drawnItems),
          (labels = layerList),
          (TheMap = map)
        );
        addToLayerList("Ecoles secondaires");
      })();
    } else {
      layerGroup.addLayer(secondaire);
      // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
      setupSearch((geoJsonLayers = layerGroup.getLayers()), (TheMap = map));
      NewCountEntytiesInZone(
        (GeoPointsDatasList = layerGroup.getLayers()),
        (drawnItems = drawnItems),
        (labels = layerList),
        (TheMap = map)
      );
      addToLayerList("Ecoles secondaires");
    }
  }
});

$("#superieur").on("click", function () {
  $(this).toggleClass("open");
  if (superieur != null && layerGroup.hasLayer(superieur)) {
    layerGroup.removeLayer(superieur);
    dropFromLayerList("Ecoles superieures");
  } else {
    if (superieur == null) {
      (async function () {
        var color = await getRandomColor();
        superieur = await AddPointsWFS({
          fromGeoServer: true,
          TheMap: map,
          layer: "education:superieur",
          url: "http://srv558546.hstgr.cloud:8080/geoserver/education/ows",
          opacity: 0.6,
          fillColor: color,
          color: color,
          icon: superieurIcon({ color: color }),
        }
      );
      superieur.nom="Ecoles superieures";

        // Ajouter le layer au layerBoundsGroup
        layerGroup.addLayer(superieur);
        // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
        setupSearch((geoJsonLayers = layerGroup.getLayers()), (TheMap = map));
        NewCountEntytiesInZone(
          (GeoPointsDatasList = layerGroup.getLayers()),
          (drawnItems = drawnItems),
          (labels = layerList),
          (TheMap = map)
        );
        addToLayerList("Ecoles superieures");
      })();
    } else {
      layerGroup.addLayer(superieur);
      // A CHAQUE FOIS QUE L'ON AJOUTE UNE COUCHE DE POINTS IL EST IMPORTANT DE REINITAILER LA RECHERCHE avec le nouveau layergroup
      setupSearch((geoJsonLayers = layerGroup.getLayers()), (TheMap = map));
      NewCountEntytiesInZone(
        (GeoPointsDatasList = layerGroup.getLayers()),
        (drawnItems = drawnItems),
        (labels = layerList),
        (TheMap = map)
      );
      addToLayerList("Ecoles superieures");
    }
  }
});

/* EDUCATION */

/* CENTRE */
$("#departements").on("click", function () {
  $(this).toggleClass("open");
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
});

$("#arrondissements").on("click", function () {
  $(this).toggleClass("open");
  if (arrondissements != null && layerBoundsGroup.hasLayer(arrondissements)) {
    layerBoundsGroup.removeLayer(arrondissements);
  } else {
    if (arrondissements == null) {
      (async function () {
        var color = await getRandomColor();
        arrondissements = await AddPointsWFS({
          fromGeoServer: true,
          TheMap: map,
          layer: "centre:arrondissement centre",
          url: "http://srv558546.hstgr.cloud:8080/geoserver/centre/wms",
          opacity: 0.5,
          fillColor: color,
          color: color,
        });

        // Ajouter le layer au layerBoundsGroup
        layerBoundsGroup.addLayer(arrondissements);
      })();
    } else {
      layerBoundsGroup.addLayer(arrondissements);
    }
  }
});

$("#communes").on("click", function () {
  $(this).toggleClass("open");
  if (communes != null && layerBoundsGroup.hasLayer(communes)) {
    layerBoundsGroup.removeLayer(communes);
  } else {
    if (communes == null) {
      (async function () {
        var color = await getRandomColor();
        communes = await AddPointsWFS({
          fromGeoServer: true,
          TheMap: map,
          layer: "centre:communes",
          url: "http://srv558546.hstgr.cloud:8080/geoserver/centre/wms",
          opacity: 0.5,
          fillColor: color,
          color: color,
        });

        // Ajouter le layer au layerBoundsGroup
        layerBoundsGroup.addLayer(communes);
      })();
    } else {
      layerBoundsGroup.addLayer(communes);
    }
  }
});

/* CENTRE */
