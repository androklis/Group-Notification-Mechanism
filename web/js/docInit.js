$(function () {
    $('div#index-banner').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);
   
    $(window).resize(function () {
        $('div#index-banner').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);
    });
});

