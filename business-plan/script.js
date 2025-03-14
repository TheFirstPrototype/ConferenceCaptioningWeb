$(document).ready(function() {

     function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function handleScrollAnimation(){
        $(".section").each(function(){
            if(isElementInViewport(this)){
                $(this).addClass("active");
            }
        })
    }

  $(window).on("scroll", function(){
    handleScrollAnimation();
   });
  
   handleScrollAnimation();
});