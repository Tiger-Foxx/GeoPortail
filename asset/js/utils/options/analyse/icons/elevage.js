var volailleIcon = function ({color='red'}){
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<i class='fa-solid fa-egg' style='font-size: 25px; color: ${color};'></i>`,
        iconSize: [25, 25], // Taille du conteneur
        iconAnchor: [0, 0] // Ancre de l'icône
      });
}