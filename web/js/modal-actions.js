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
        if (xhr.status === 200 || xhr.status === 401) {
            $("div[id=" + $('#uuid').val() + "]").remove();
        }
        $('.progress').toggle();
        $("#schemesContainer").mixItUp('filter', 'all');
        $('#schemesContainer').mixItUp('sort', 'timestamp:desc');
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
        $('#addModal #addBtn').addClass('disabled');

        var rcpts = [];

        $("#addModal .contactsList").children(".chip").each(function () {
            rcpts.push($(this).attr('id'));
        });

        var tz = new Date().getTimezoneOffset() / 60;
        var timeZoneOffset = '';
        if (tz > -10 && tz < 10) {
            if (tz <= 0) {
                timeZoneOffset = '+0' + Math.abs(tz);
            } else if (tz > 0) {
                timeZoneOffset = '-0' + Math.abs(tz);
            }
        } else {
            if (tz <= 0) {
                timeZoneOffset = '+' + Math.abs(tz);
            } else if (tz > 0) {
                timeZoneOffset = '-' + Math.abs(tz);
            }
        }

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
            calendarId: $('#addModal #calendars option:selected').val(),
            date: $('#addModal #date').val(),
            time: $('#addModal #time').val(),
            eventStart: $('#calendarModal #startDate').val() + ' ' + $('#calendarModal #startTime').val(),
            eventEnd: $('#calendarModal #endDate').val() + ' ' + $('#calendarModal #endTime').val(),
            timeZoneOffset: timeZoneOffset,
            type: 'ADD'
        };

        $.post("GNMServlet", {json: json}, function (response, statusText, xhr) {
            if (xhr.status === 200) {
                if (response.status === "Error Sending") {
                    $('#errorModal').openModal();
                } else {
                    if ($("div[id=" + json.eventId + "]")) {
                        $("div[id=" + json.eventId + "]").remove();
                    }

                    if ((json.eventId === "0") && (json.calendarId !== "0")) {
                        createCard(response.id, response.calendarId, response.eventId, 'scheme owner', json.subject, json.message, json.contacts, json.date + ' ' + json.time + '||' + json.eventStart + ' - ' + json.eventEnd, response.status, '#ffab40');
                    } else {
                        createCard(response.id, response.calendarId, response.eventId, 'scheme', json.subject, json.message, json.contacts, json.date + ' ' + json.time + '||' + json.eventStart + ' - ' + json.eventEnd, response.status, '#ffab40');
                    }
                }
            }
            $('.progress').toggle();
            $('#addModal').closeModal();
            onModalComplete();
            $("#schemesContainer").mixItUp('filter', 'all');
            $('#schemesContainer').mixItUp('sort', 'timestamp:desc');
        }, "json");
    }
}

function updateCard() {

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
        $('#addModal #addBtn').addClass('disabled');

        var rcpts = [];

        $("#addModal .contactsList").children(".chip").each(function () {
            rcpts.push($(this).attr('id'));
        });

        var tz = new Date().getTimezoneOffset() / 60;
        var timeZoneOffset = '';
        if (tz > -10 && tz < 10) {
            if (tz <= 0) {
                timeZoneOffset = '+0' + Math.abs(tz);
            } else if (tz > 0) {
                timeZoneOffset = '-0' + Math.abs(tz);
            }
        } else {
            if (tz <= 0) {
                timeZoneOffset = '+' + Math.abs(tz);
            } else if (tz > 0) {
                timeZoneOffset = '-' + Math.abs(tz);
            }
        }

        window.scrollTo(0, 0);
        $('.progress').toggle();

        var owner = 0;

        if ($("div[id=" + $('#uuid').val() + "]").hasClass('owner') && $('#addModal #calendars option:selected').val() !== '0') {
            owner = 1;
        } else if (!$("div[id=" + $('#uuid').val() + "]").hasClass('owner') && $('#addModal #calendars option:selected').val() !== '0') {
            owner = 2;
        }

        var json = {
            id: $('#uuid').val(),
            eventId: $("div[id=" + $('#uuid').val() + "]").find('#eventId').val(),
            user_email: $.cookie("email"),
            contacts: rcpts.join(','),
            subject: $('#addModal #subject').val(),
            message: $('#addModal #message').val(),
            now: $('#addModal #now').is(':checked'),
            calendarId: $('#addModal #calendars option:selected').val(),
            date: $('#addModal #date').val(),
            time: $('#addModal #time').val(),
            eventStart: $('#calendarModal #startDate').val() + ' ' + $('#calendarModal #startTime').val(),
            eventEnd: $('#calendarModal #endDate').val() + ' ' + $('#calendarModal #endTime').val(),
            timeZoneOffset: timeZoneOffset,
            owner: owner,
            type: 'UPDATE'
        };

        $.post("GNMServlet", {json: json}, function (response, statusText, xhr) {
            if (xhr.status === 200) {

                if (response.status === "Error Updating") {
                    $('#errorModal').openModal();
                } else {
                    if ($("div[id=" + json.id + "]").hasClass('owner')) {
                        $("div[id=" + json.id + "]").remove();
                        createCard(json.id, json.calendarId, response.eventId, 'scheme owner', json.subject, json.message, json.contacts, json.date + ' ' + json.time + '||' + $('#calendarModal #startDate').val() + ' ' + $('#calendarModal #startTime').val() + ' - ' + $('#calendarModal #endDate').val() + ' ' + $('#calendarModal #endTime').val(), response.status, '#ffab40');
                    } else {
                        $("div[id=" + json.id + "]").remove();
                        createCard(json.id, json.calendarId, response.eventId, 'scheme', json.subject, json.message, json.contacts, json.date + ' ' + json.time + '||' + $('#calendarModal #startDate').val() + ' ' + $('#calendarModal #startTime').val() + ' - ' + $('#calendarModal #endDate').val() + ' ' + $('#calendarModal #endTime').val(), response.status, '#ffab40');
                    }

                    $('.progress').toggle();
                    $('#addModal').closeModal();
                    onModalComplete();
                    $("#schemesContainer").mixItUp('filter', 'all');
                    $('#schemesContainer').mixItUp('sort', 'timestamp:desc');
                }
            }

        }, "json");
    }
}

function copyCard() {

    window.scrollTo(0, 0);
    $('.progress').toggle();

    var card = $("div[id=" + $('#uuid').val() + "]");

    var json = {
        id: $('#uuid').val(),
        user_email: $.cookie("email"),
        contacts: card.find('#rcpts').val(),
        subject: card.find('#adr_title').text(),
        message: card.find('#adr_description').text(),
        now: $('#copyModal #cpNow').is(':checked'),
        date: $('#copyModal #cpDate').val(),
        time: $('#copyModal #cpTime').val(),
        type: 'COPY'
    };

    $.post("GNMServlet", {json: json}, function (response, statusText, xhr) {
        if (xhr.status === 200) {
            createCard(response.id, "0", "0", 'scheme', card.find('#adr_title').text(), card.find('#adr_description').text(), card.find('#rcpts').val(), json.date + ' ' + json.time + '||', response.status, '#ffab40');
        }
        $('.progress').toggle();
        $("#schemesContainer").mixItUp('filter', 'all');
        $('#schemesContainer').mixItUp('sort', 'timestamp:desc');
    });

}