$(function () {
    $('div#index-banner').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);

    $('.button-collapse').sideNav();
    $('.collapsible').collapsible();

    $("#search").focus(function () {
        $(".search-wrapper").addClass('focused');
    });

    $("#search").focusout(function () {
        $(".search-wrapper").removeClass('focused');
    });

    $('ul li:not(.no-padding)').click(function () {
        $('li').removeClass("active");
        $(this).addClass("active");
    });

    $(window).resize(function () {
        $('div#index-banner').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);
    });
});
