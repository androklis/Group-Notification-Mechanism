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
    console.log('#email', $.cookie("email"));
    console.log('#contacts', $('#addModal #contacts').val());
    console.log('#subject', $('#addModal #subject').val());
    console.log('#message', $('#addModal #message').val());
    console.log('#date', $('#addModal #date').val());
    console.log('#time', $('#addModal #time').val());
    console.log('#now', $('#addModal #now').is(':checked'));
    console.log('#calendars', $('#addModal #calendars').val());

    window.scrollTo(0, 0);
    $('.progress').toggle();

    var json = {
        id: $('#uuid').val(),
        user_email: $.cookie("email"),
        contacts: $('#addModal #contacts').val().toString(),
        subject: $('#addModal #subject').val(),
        message: $('#addModal #message').val(),
        now: $('#addModal #now').is(':checked'),
        calendars: $('#addModal #calendars').val(),
        date: $('#addModal #date').val(),
        time: $('#addModal #time').val(),
        eventStart: $('#calendarModal #startDate').val() + ' ' + $('#calendarModal #startTime').val(),
        eventEnd: $('#calendarModal #endDate').val() + ' ' + $('#calendarModal #endTime').val(),
        type: 'ADD'
    };

    $.post("GNMServlet", {json: json}, function (response, statusText, xhr) {
        if (xhr.status === 200) {
            if (json.id !== "0") {
                $("div[id=" + $('#uuid').val() + "]").remove();
            }
            if (response.status === "Error Sending") {
                createCard(json.id, 'scheme', json.subject, json.message, json.contacts, json.date + ' ' + json.time, response.status, '#ff0000');
            } else {
                createCard(json.id, 'scheme', json.subject, json.message, json.contacts, json.date + ' ' + json.time, response.status, '#ffab40');
            }
        }
        $('.progress').toggle();
    });
}