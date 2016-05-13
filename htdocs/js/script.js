/* Author:
 JCO 2015/11/25
 */
var windW = $(window).width();
var windH = $(window).height();
var carousel = $('#slider .slider__list');
var carouEl = $('.slider__li');
var carouImg = $('.slider__img');
var slider = $('#slider');
var wrapper = $('.wrapper');
var ratioImg;

$.airDeParis = {
	init : function() {
		ratioImg = parseInt(carouEl.find('img').width()) / parseInt(carouEl.find('img').height());

		$.airDeParis.slider();
		
		$(".menu__burger").click(function(e) {
			e.preventDefault();
		  	$('.menu__contenair').toggle();
		});
		
		$('input[type="range"]').rangeslider({polyfill: false});
		
		$("#labelMarques").click(function(e){
			e.preventDefault();
			if( $(".filter__marquesBox").css('display') === "inline-block" ){
				$(".filter__marquesBox").css('display','none');
			}else{
				$(".filter__marquesBox").css('display','inline-block');
			}
		});
		
		$('.footer__btContact').click(function(e){
			e.preventDefault();
			$('.contact').slideToggle();
		});
		
		$('.close').bind( "click", function(e) {
			e.preventDefault();
			$('.popin').fadeOut("slow");	
		});
		
		$('.linkPopin').bind("click", function(e) {
			e.preventDefault();
			$('.popin').fadeIn("slow");
		})
		
		$('.filter__labelMobile').bind("click", function(e) {
			e.preventDefault();
			$('.filter__ul').toggle();
		});

		
	},
	slider : function() {
		if(!carousel.length>0)
			return;
			
		carousel.carouFredSel({
			responsive : true,
			items : {
				visible : 1
			},
			scroll : {
				duration : 250,
				timeoutDuration : 11500
			},
			pagination : '#pager'
		});
				
		$(window).bind( 'resize', function() {
			var $elems = $('.slider, .caroufredsel_wrapper, .slider__list');
			var height = carouImg.outerHeight(true);
			$elems.height( height );
		});

	}//end slider
}//end $.airDeParis

$(window).load(function() {
	$.airDeParis.init();
});

$(window).resize(function() {

});

