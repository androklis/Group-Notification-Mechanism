$(function () {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);

    initComponents();
    addFormRules();

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
            onModalComplete();
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

        $('#schemesContainer').mixItUp({
            load: {
                filter: 'all'
            }
        });

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
    }

    $(window).resize(function () {
        $('div#index-banner').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);
    });

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
                                                result.suggestions.push({"value": value.title.$t + ' (' + value.gd$email[0].address.split('@')[1] + ')', "data": value.gd$email[0].address, "img": (value.link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token")});
                                            } else {
                                                result.suggestions.push({"value": value.title.$t + ' (' + value.gd$email[0].address.split('@')[1] + ')', "data": value.gd$email[0].address, "img": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50"});
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
            if (!document.getElementById(suggestion.data)) {
                $('.contactsList').append('<div id="' + suggestion.data + '" class="chip"><img src="' + suggestion.img + '">' + suggestion.value + '<i class="material-icons">close</i></div>');
            }
            $("#contacts").val('');

            if (!$('#addForm .contactsList').is(':empty')) {
                $('#addForm .con').css('display', 'none');
            } else {
                $('#addForm .con').css('display', 'block');
            }
        }
    });
});
function appSettings() {
    $('#settingsModal').openModal();
}

function toggleSuggestions() {
    if (!$('#suggChk').is(':checked')) {
        $('#suggChk').prop('checked', true);
    }
}

function addFormRules() {

    $("#contacts").keyup(function (e) {
        if (!$('#addForm .contactsList').is(':empty')) {
            $('#addForm .con').css('display', 'none');
        } else {
            $('#addForm .con').css('display', 'block');
        }
    });

    $('#addForm #subject').on('input', function () {
        if ($.trim($(this).val())) {
            $('#addForm .sub').css('display', 'none');
        } else {
            $('#addForm .sub').css('display', 'block');
        }
    });

    $('#addForm #message').on('keyup', function () {
        if ($.trim($(this).val())) {
            $('#addForm .msg').css('display', 'none');
        } else {
            $('#addForm .msg').css('display', 'block');
        }
    });
}

function onModalComplete() {
    var datepicker = $('#addModal #date').pickadate({});
    var picker = datepicker.pickadate('picker');
    picker.set('max', false);
    picker.set('select', new Date().toISOString().substring(0, 10), {format: 'yyyy-mm-dd'});
    $("#addModal #now").prop("checked", true);
    $("select#calendars").val('0');
    $('select#calendars').material_select();
    $('#addModal .contactsList').empty();
    $("#addModal #contacts").val('');
    $("#addModal #subject").val('');
    $("#addModal #message").val('');
    $("#addModal #eventId").val('0');
    $("label[for='contacts']").removeClass('active');
    $("label[for='subject']").removeClass('active');
    $("label[for='message']").removeClass('active');
    $('select#calendars').prop('disabled', false);
}

function expandAll() {
    $("#attPeople .collapsible-header").addClass("active");
    $("#attPeople.collapsible").collapsible({accordion: false});
}

function collapseAll() {
    $("#attPeople .collapsible-header").removeClass(function () {
        return "active";
    });
    $("#attPeople.collapsible").collapsible({accordion: true});
    $("#attPeople.collapsible").collapsible({accordion: false});
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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