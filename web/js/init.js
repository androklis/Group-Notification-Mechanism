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

$(function () {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);

    initComponents();

    $('select#contacts').on('change', function () {
        if (($('select#contacts').val()[$('select#contacts').val().length - 1]).indexOf("@") < 0) {
            console.log($('select#contacts').val()[$('select#contacts').val().length - 1]);
        }
    });
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
            $('select#contacts').val('');
            $('select#contacts').material_select();
            $("#addModal #now").prop("checked", true);
            $("select#calendars").val('0');
            $('select#calendars').material_select();
            $("#addModal #subject").val('');
            $("#addModal #message").val('');
//            updateTime();
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
            picker.set('select', new Date().toISOString().substring(0, 10), {format: 'yyyy-mm-dd'});
        }
//        updateTime();
    });
    $('#addModal #addBtn').click(function () {
        $('#addModal #addForm').validate();
    });
    $('#search').keyup(function () {
        var filter = $("#search").val();
        $("#schemes .row .adr_schema").each(function (index) {
            if ($(this).find(".card-content").context.outerText.search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();
            } else {
                $(this).fadeIn("slow");
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

        var datepicker_1 = $('#date').pickadate({
            selectMonths: true,
            selectYears: 15,
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE'
        });

        var picker_1 = datepicker_1.pickadate('picker');
        picker_1.set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'});

        var datepicker_2 = $('#startDate').pickadate({
            selectMonths: true,
            selectYears: 15,
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE'
        });

        var picker_2 = datepicker_2.pickadate('picker');
        picker_2.set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'});

        var datepicker_3 = $('#endDate').pickadate({
            selectMonths: true,
            selectYears: 15,
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE'
        });

        var picker_3 = datepicker_3.pickadate('picker');
        picker_3.set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'});

        $('#time, #startTime, #endTime').pickatime({
            twelvehour: false,
            default: 'now'
        });

        updateTime();

        $('#calendarModal #startTime').val(time);
        $('#calendarModal #endTime').val(time);

//    setInterval(updateTime, 1000 * 60 * 1);
    }

    $("#autocomplete").autocomplete({
        lookup: function (query, done) {
            var result = {suggestions: []};
            $.get("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + $.cookie("access_token") + "&q=" + query + "&max-results=100&v=3.0",
                    function (response) {
                        $.each(response.feed.entry, function (index, value) {
                            if (value.gd$email) {
                                if (value.title.$t.length > 0) {
                                    if ((value.title.$t).indexOf('Google+') < 0) {
                                        result.suggestions.push({"value": value.title.$t, "data": value.gd$email[0].address});
                                    }
                                } else {
                                    result.suggestions.push({"value": value.gd$email[0].address, "data": value.gd$email[0].address});
                                }
                            }
                        });
                        done(result);
                    });
        },
        onSelect: function (suggestion) {
            alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
        }
    });
});
