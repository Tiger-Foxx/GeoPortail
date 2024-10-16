

var postesAgricolesIcon = function ({color='red'}){
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<i class='fa-solid fa-wheat-awn' style='font-size: 25px; color: ${color};'></i>`,
        iconSize: [48, 48], // Taille du conteneur
          iconAnchor: [0, 0] // Ancre de l'icône
      });
  }