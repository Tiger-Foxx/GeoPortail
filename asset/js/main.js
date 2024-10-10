
$(".search-block input").focus(function(){
    $(".search-container").addClass("focus");
})

$(".search-block input").focusout(function(){
    $(".search-container").removeClass("focus");
})
$(".leaflet-measure-action a").removeClass("start");
$(".leaflet-measure-action a").html("<i class='fa-solid fa-ruler-horizontal'></i>")
$(".leaflet-measure-action a.leaflet-measure-action").html("<i class='fa-solid fa-chart-area'></i>")
$(".js-btn-menu").on("click", function(e){
    let on = $(".on");
    
    if($(this)[0] != on[0]){
        on.removeClass("on");
        on.find(".modal").hide();
    }
    $(this).find(".modal").toggle();
    $(this).toggleClass("on");
})
$(".btn-couche").on("click", function(e){
    $(".right-aside").toggle();
    $(this).toggleClass("on");
})
$(document).on('click', function(e){
    if(!$(this).hasClass('rel')){
        let on = $(".out");
        on.find(".c-menu").hide();
        on.removeClass("out");
        on.removeClass("active");
    }
})
$(".js-btn-c-menu").on("click", function(e){
    let on = $(".out");
    
    if($(this)[0] != on[0]){
        on.removeClass("out");
        on.find(".c-menu").hide();
    }
    
    $(this).find(".c-menu").toggle();
    $(this).toggleClass("out");
})
$(".modal").on("click", function(e){
    e.stopPropagation();
})

$('.p-obj').on('click', function(e){
    $(this).toggleClass('active');
})

$('.btn-modal').on('click', function(e){
    let active = $(".active");
    if($(this)[0] != active [0]){
        active.removeClass("active");
        let tg = active.attr('element');
        $('#' + tg).hide();
    }
    let target = $(this).attr('element');
    $('#' + target).toggle();
    $(this).toggleClass('active');
})
$(".leaflet-measure-action a").on("click", function(){
    notis.create("info", "Faites un clic droit pour stoper les mesures", 4);
})

