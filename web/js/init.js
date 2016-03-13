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

    $('.button-collapse').sideNav();

    var datepicker = $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 15,
        min: true,
        format: 'yyyy-mm-dd',
        today: 'TODAY',
        clear: '',
        close: 'DONE'
    });

    var picker = datepicker.pickadate('picker');

    $('.timepicker').pickatime({
        twelvehour: false,
        default: 'now'
    });

    picker.set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'});

    updateTime();

    setInterval(updateTime, 1000 * 60 * 1);

    $('select#contacts').on('change', function () {
        if (($('select#contacts').val()[$('select#contacts').val().length - 1]).indexOf("@") < 0) {
            console.log($('select#contacts').val()[$('select#contacts').val().length - 1]);
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
            updateTime();
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
        updateTime();
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
});
