$('#btn-info').on('click', function(e) {
    $('#btn-info').toggleClass("open");
    $('#map-div').toggleClass("info");
    $('.leaflet-interactive').toggleClass("info");
    console.log('mode info...');
    isInfo=!isInfo;
});