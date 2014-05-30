(function($) {

  $(document).on('ready', function() {

    var $nav   = $('nav')
      , $close = $('.icon-close')
      , $open  = $('.icon-menu');

    $open.on('click', function() {
      $nav.addClass('exposed');
    });

    $close.on('click', function() {
      $nav.removeClass('exposed');
    });

  });

  
 var mySwiper = new Swiper('.swiper-container', {
    pagination: '.pagination',
    loop: false,
    grabCursor: true,
    paginationClickable: true
  });

  // $('.arrow-left').on('click', function(e){
  //   e.preventDefault();
  //   mySwiper.swipePrev();
  // });

  // $('.arrow-right').on('click', function(e){
  //   e.preventDefault();
  //   mySwiper.swipeNext();
  // });

 var story_swiper = new Swiper('.story-swiper-container', {
    pagination: '.story_pagination',
    loop: true,
    grabCursor: true,
    paginationClickable: true
  });

  $('.story_arrow_left').on('click', function(e){
    e.preventDefault();
    story_swiper.swipePrev();
  });

  $('.story_arrow_right').on('click', function(e){
    e.preventDefault();
    story_swiper.swipeNext();
  });





})( jQuery );