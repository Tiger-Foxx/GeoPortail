$(".search-block input").focus(function(){
    $(".search-container").addClass("focus");
})

$(".search-block input").focusout(function(){
    $(".search-container").removeClass("focus");
})

$(".btn-menu").on("click", function(e){
    let on = $(".on");
    
    if($(this)[0] != on[0]){
        on.removeClass("on");
        on.find(".modal").hide();
    }
    
    $(this).find(".modal").toggle();
    $(this).toggleClass("on");
})
$(".modal").on("click", function(e){
    e.stopPropagation();
})

$('.p-obj').on('click', function(e){
    $(this).toggleClass('active');
})