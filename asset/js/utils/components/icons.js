


var primaireIcon = function ({color='red'}){
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<i class='fa-solid fa-child-reaching' style='font-size: 15px; color: ${color};'></i>`,
        iconSize: [32, 32], // Taille du conteneur
        iconAnchor: [32, 32] // Ancre de l'icône
      });
}

var secondaireIcon = function ({color='red'}){
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<i class='fa-solid fa-chalkboard-user' style='font-size: 15px; color: ${color};'></i>`,
        iconSize: [32, 32], // Taille du conteneur
        iconAnchor: [32, 32] // Ancre de l'icône
      });
}