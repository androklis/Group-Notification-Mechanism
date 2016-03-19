$(function () {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
    initComponents();

    $('select#calendars').on('change', function () {
        if ($('select#calendars').val().length > 1) {
            $('#eventSettings').removeClass('disabled');
            $('#calendarModal').openModal({
                complete: function () {
                }
            });
        } else {
            $('#eventSettings').addClass('disabled');
        }
    });
    $('#eventSettings').on('click', function () {
        if (!$('#eventSettings').hasClass('disabled')) {
            $('#calendarModal').openModal({
                complete: function () {
                }
            });
        }
    });
    $('#addBtn.modal-trigger').leanModal({
        complete: function () {
            $("#addModal #now").prop("checked", true);
            $("select#calendars").val('0');
            $('select#calendars').material_select();
            $("#addModal #subject").val('');
            $("#addModal #message").val('');
        }, ready: function () {
            $('#uuid').val('0');
            $('#addModal #date, #addModal #time').prop('disabled',
                    $('#addModal #now').is(':checked'));
        }
    });
    $('#addModal #now').click(function () {
        $('#addModal #date, #addModal #time').prop('disabled',
                $('#addModal #now').is(':checked'));
        if ($('#addModal #now').is(':checked')) {
            $('#date').pickadate('picker').set('select', new Date().toISOString().substring(0, 10), {format: 'yyyy-mm-dd'});
        }
    });
    $('#addModal #addBtn').click(function () {
        $('#addModal #addForm').validate();
    });
    $('#search').keyup(function () {
        var filter = $("#search").val();
        $("#schemes .row .adr_schema").each(function (index) {
            if ($(this).find(".card-content").context.outerText.search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut(1000);
            } else {
                $(this).fadeIn(1000);
            }
        });
    });
    $('#schemes .chip').click(function () {
        $(this).siblings(".chip").removeClass("selected");
        $(this).toggleClass("selected");
        var filter = $(this).data("value");
        if (filter === 'all') {
            $("#schemes .row .adr_schema").filter(':hidden').fadeIn(1000);
        } else {
            $("#schemes .row .adr_schema").each(function (index) {
                if (!$(this).hasClass(filter)) {
                    $(this).fadeOut(1000);
                } else {
                    $(this).fadeIn(1000);
                }
            });
        }
    });
    function initComponents() {

        var today = new Date();
        var day = today.getDate();
        var monthIndex = today.getMonth() + 1;
        var year = today.getFullYear();
        var time = checkTime(today.getHours()) + ':'
                + checkTime(today.getMinutes());
        $('.button-collapse').sideNav();
        $('div#index-banner').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);
//        $('div#welcomeScreen').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);

        $('#date').pickadate({
            selectMonths: true,
            selectYears: 15,
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE'
        });
        $('#date').pickadate('picker').set('select', new Date().toISOString().substring(0, 10), {format: 'yyyy-mm-dd'});
        $('#startDate').pickadate({
            selectMonths: true,
            selectYears: 15,
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE'
        });
        $('#startDate').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'});
        $('#endDate').pickadate({
            selectMonths: true,
            selectYears: 15,
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE'
        });
        $('#endDate').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'});
        $('#time, #startTime, #endTime').pickatime({
            twelvehour: false,
            default: 'now'
        });
        updateTime();
        $('#calendarModal #startTime').val(time);
        $('#calendarModal #endTime').val(time);
//    setInterval(updateTime, 1000 * 60 * 1);
    }

    $("#contacts").autocomplete({
        lookup: function (query, done) {
            var result = {suggestions: []};

            $.get("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + $.cookie("access_token") + "&q=" + query + "&max-results=100&v=3.0",
                    function (response) {
                        try {
                            $.each(response.feed.entry, function (index, value) {
                                if (value.gd$email) {
                                    if (value.title.$t.length > 0) {
                                        if ((value.title.$t).indexOf('Google+') < 0) {
                                            if (value.link[0].gd$etag) {
                                                result.suggestions.push({"value": value.title.$t, "data": value.gd$email[0].address, "img": (value.link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token")});
                                            } else {
                                                result.suggestions.push({"value": value.title.$t, "data": value.gd$email[0].address, "img": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50"});
                                            }
                                        }
                                    } else {
                                        if (value.link[0].gd$etag) {
                                            result.suggestions.push({"value": value.gd$email[0].address, "data": value.gd$email[0].address, "img": (value.link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token")});
                                        } else {
                                            result.suggestions.push({"value": value.gd$email[0].address, "data": value.gd$email[0].address, "img": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50"});
                                        }
                                    }
                                }
                            });
                        } catch (error) {
                            console.error('ERROR', error);
                        } finally {
                            done(result);
                        }
                    });
        },
        onSelect: function (suggestion) {
//            alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
        }
    });

});
function appSettings() {
    $('#settingsModal').openModal();
}

function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}

function updateTime() {
    var today = new Date();
    var day = today.getDate();
    var monthIndex = today.getMonth() + 1;
    var year = today.getFullYear();
    var time = checkTime(today.getHours()) + ':'
            + checkTime(today.getMinutes());
    if ($('#addModal #now').is(':checked')) {
        $('#addModal #date').val(year + '-' + monthIndex + '-' + day);
        $('#addModal #time').val(time);
    }
}