var hotelsIcon = function ({color='red'}){
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<i class='fa-solid fa-hotel' style='font-size: 25px; color: ${color};'></i>`,
        iconSize: [48, 48], // Taille du conteneur
          iconAnchor: [0, 0] // Ancre de l'icône
      });
  }

  var restaurantsIcon = function ({color='red'}){
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<i class='fa-solid fa-utensils' style='font-size: 25px; color: ${color};'></i>`,
        iconSize: [48, 48], // Taille du conteneur
          iconAnchor: [0, 0] // Ancre de l'icône
      });
  }
