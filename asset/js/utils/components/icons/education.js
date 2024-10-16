


var primaireIcon = function ({color='red'}){
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<i class='fa-solid fa-child-reaching' style='font-size: 25px; color: ${color};'></i>`,
        iconSize: [25, 25], // Taille du conteneur
        iconAnchor: [0, 0] // Ancre de l'icône
      });
}

var secondaireIcon = function ({color='red'}){
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<i class='fa-solid fa-chalkboard-user' style='font-size: 25px; color: ${color};'></i>`,
        iconSize: [48, 48], // Taille du conteneur
        iconAnchor: [0, 0] // Ancre de l'icône
      });
}

var superieurIcon = function ({color='red'}){
  return L.divIcon({
      className: 'custom-div-icon',
      html: `<i class='fa-solid fa-graduation-cap' style='font-size: 25px; color: ${color};'></i>`,
      iconSize: [48, 48], // Taille du conteneur
        iconAnchor: [0, 0] // Ancre de l'icône
    });
}

var institutsIcon = function ({color='red'}){
  return L.divIcon({
      className: 'custom-div-icon',
      html: `<i class='fa-solid fa-building-columns' style='font-size: 25px; color: ${color};'></i>`,
      iconSize: [48, 48], // Taille du conteneur
        iconAnchor: [0, 0] // Ancre de l'icône
    });
}

var laboratoiresIcon = function ({color='red'}){
  return L.divIcon({
      className: 'custom-div-icon',
      html: `<i class='fa-solid fa-microscope' style='font-size: 25px; color: ${color};'></i>`,
      iconSize: [48, 48], // Taille du conteneur
        iconAnchor: [0, 0] // Ancre de l'icône
    });
}
