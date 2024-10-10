const targetElement = document.getElementById('targetElement');
    const contextMenu = document.getElementById('contextMenu');

    // Afficher le menu contextuel lors du clic droit
    targetElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();  // Empêche le menu contextuel par défaut du navigateur

        // Positionner le menu contextuel là où se trouve la souris
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;
    });

    // Masquer le menu contextuel si l'utilisateur clique en dehors
    document.addEventListener('click', function () {
        contextMenu.style.display = 'none';
    });

    // Ajouter des actions aux options du menu
    document.getElementById('option1').addEventListener('click', function () {
        alert('Option 1 sélectionnée');
    });

    document.getElementById('option2').addEventListener('click', function () {
        alert('Option 2 sélectionnée');
    });

    document.getElementById('option3').addEventListener('click', function () {
        alert('Option 3 sélectionnée');
    });