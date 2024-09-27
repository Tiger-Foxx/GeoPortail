$(".search-block input").focus(function(){
    $(".search-container").addClass("focus");
})

$(".search-block input").focusout(function(){
    $(".search-container").removeClass("focus");
})

$(".js-btn-menu").on("click", function(e){
    let on = $(".on");
    
    if($(this)[0] != on[0]){
        on.removeClass("on");
        on.find(".modal").hide();
    }
    $(this).find(".modal").toggle();
    $(this).toggleClass("on");
})
$(document).on('click', function(e){
    if(!$(this).hasClass('rel')){
        console.log('ok')
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