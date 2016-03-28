function saveSettings() {

}

$('#suggChk').change(function () {
    if ($(this).is(':checked')) {
        $('#schemes').find("div[data-filter='all']").click();
    } else {
        $('#schemes').find("div[data-filter='.scheme']").click();
    }
});

function delCard() {
    window.scrollTo(0, 0);
    $('.progress').toggle();

    var json = {
        id: $('#uuid').val(),
        user_email: $.cookie("email"),
        type: 'DELETE'
    };

    $.post("GNMServlet", {json: json}, function (response, statusText, xhr) {
        if (xhr.status === 200) {
            $("div[id=" + $('#uuid').val() + "]").remove();
        }
        $('.progress').toggle();
    });
}

function addCard() {

    if ($('#addForm .contactsList').is(':empty') && $('#addForm .error.con').css('display') === 'none') {
        $('#addForm .con').css('display', 'block');
    } else if (!$('#addForm .contactsList').is(':empty') && $('#addForm .error.con').css('display') !== 'none') {
        $('#addForm .con').css('display', 'none');
    }
    if (!$('#addForm #subject').val() && $('#addForm .error.sub').css('display') === 'none') {
        $('#addForm .sub').css('display', 'block');
    } else if ($('#addForm #subject').value && $('#addForm .error.sub').css('display') !== 'none') {
        $('#addForm .sub').css('display', 'none');
    }
    if (!$.trim($("#addForm #message").val()) && $('#addForm .error.msg').css('display') === 'none') {
        $('#addForm .msg').css('display', 'block');
    } else if ($.trim($("#addForm #message").val()) && $('#addForm .error.msg').css('display') !== 'none') {
        $('#addForm .msg').css('display', 'none');
    }


    if ((!$('#addForm .contactsList').is(':empty')) && ($.trim($('#addForm #subject').val())) && ($.trim($("#addForm #message").val()))) {
        var rcpts = [];

        $("#addModal .contactsList").children(".chip").each(function () {
            rcpts.push($(this).attr('id'));
        });

        console.log('#uuid', $('#uuid').val());
        console.log('#eventId', $('#addModal #eventId').val());
        console.log('#email', $.cookie("email"));
        console.log('#contacts', rcpts.join(','));
        console.log('#subject', $('#addModal #subject').val());
        console.log('#message', $('#addModal #message').val());
        console.log('#date', $('#addModal #date').val());
        console.log('#time', $('#addModal #time').val());
        console.log('#now', $('#addModal #now').is(':checked'));
        console.log('#calendars', $('#addModal #calendars').val());
        console.log('#startDate', $('#calendarModal #startDate').val());
        console.log('#startTime', $('#calendarModal #startTime').val());
        console.log('#endDate', $('#calendarModal #endDate').val());
        console.log('#endTime', $('#calendarModal #endTime').val());

        window.scrollTo(0, 0);
        $('.progress').toggle();

        var json = {
            id: $('#uuid').val(),
            eventId: $('#addModal #eventId').val(),
            user_email: $.cookie("email"),
            contacts: rcpts.join(','),
            subject: $('#addModal #subject').val(),
            message: $('#addModal #message').val(),
            now: $('#addModal #now').is(':checked'),
            calendarId: $('#addModal #calendars').val(),
            date: $('#addModal #date').val(),
            time: $('#addModal #time').val(),
            eventStart: $('#calendarModal #startDate').val() + ' ' + $('#calendarModal #startTime').val(),
            eventEnd: $('#calendarModal #endDate').val() + ' ' + $('#calendarModal #endTime').val(),
            type: 'ADD'
        };

        $.post("GNMServlet", {json: json}, function (response, statusText, xhr) {
            if (xhr.status === 200) {
                if ((json.eventId !== "0") && (json.calendarId !== "0")) {
                    $("div[id=" + json.eventId + "]").remove();
                }
                if (response.status === "Error Sending") {
                    createCard(response.id, response.calendarId, response.eventId, 'scheme', json.subject, json.message, json.contacts, json.date + ' ' + json.time, response.status, '#ff0000');
                } else {
                    createCard(response.id, response.calendarId, response.eventId, 'scheme', json.subject, json.message, json.contacts, json.date + ' ' + json.time, response.status, '#ffab40');
                }
            }
            $('.progress').toggle();
            $('#addModal').closeModal();
        });
    }
}