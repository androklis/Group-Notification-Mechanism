function saveSettings() {

}

$('#suggChk').change(function () {
    if ($(this).is(':checked')) {
        $('*[class*=suggestion]').each(function () {
            $(this).slideDown(1000);
        });
    } else {
        $('*[class*=suggestion]').each(function () {
            $(this).slideUp(1000);
        });
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

    console.log('#uuid', $('#uuid').val());
    console.log('#eventId', $('#addModal #eventId').val());
    console.log('#email', $.cookie("email"));
    console.log('#contacts', $('#addModal #contacts').data().autocomplete.selection.data);
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
        contacts: $('#addModal #contacts').data().autocomplete.selection.data,
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
    });
}