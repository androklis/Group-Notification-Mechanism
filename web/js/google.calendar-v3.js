/* global gapi */

/**
 * Load Google Calendar client library. List upcoming events once client library
 * is loaded.
 */
function loadCards(userEmail, schemes) {

    $.each(schemes, function (index, value) {
        var element = jQuery(".adr_schema:first").clone();
        element.attr('id', value.uuid);
        element.addClass('scheme');
        element.find("#adr_title").html(value.subject);
        element.find("#adr_description").html(value.message);
        element.find(".card-action").append('<span id="timestamp" class="badge left light-blue-text">' + value.timestamp + '</span>');

        var guests = [];
        var i = 0;
        $.each(value.recipients.split(', '), function (index, attendee) {
            guests.push(attendee);
            i++;
        });
        element.find(".card-action").append('<i class="material-icons waves-effect waves-light tooltipped left orange-text" data-position="right" data-delay="50" data-tooltip="' + i + '">people</i>');

        element.find(".card-action").append('<a href="javascript:void(0);" id="deleteScheme"><i class="material-icons waves-effect waves-light right red-text">delete_forever</i></a>');
        if (value.status === "Pending") {
            element.find(".card-action").append('<a href="javascript:void(0);" id="editScheme"><i class="material-icons waves-effect waves-light right black-text">mode_edit</i></a>');
        } else {
            element.find(".card-action").append('<a href="javascript:void(0);" id="duplicateScheme"><i class="material-icons waves-effect waves-light right black-text">repeat_one</i></a>');
        }

        element.find(".card-action").append('<a href="javascript:void(0);" id="viewCard"><i class="material-icons waves-effect waves-light right orange-text">launch</i></a>');
        element.find("#adr_badge").html(value.status).css('color', '#ffab40');
        element.find("#rcpts").val(guests);
        element.appendTo("#schemes .row").slideDown(1000);
    });

    var schemeIds = [];

    $("#schemes .row .adr_schema").each(function () {
        schemeIds.push($(this).attr('id'));
    });

    gapi.client.load('calendar', 'v3', function () {
        var request = gapi.client.calendar.calendarList.list();
        request.execute(function (resp) {
            $.each(resp.items, function (index, value) {
                if (value.primary) {
                    $('select#calendars').append('<option value="' + value.id + '">Primary Calendar</option>');
                } else {
                    $('select#calendars').append('<option value="' + value.id + '">' + value.summary + ' Calendar</option>');
                }
                listUpcomingEvents(userEmail, schemeIds, value.id, value.summary, value.backgroundColor);
            });
            $('select#calendars').material_select();
        });
    });
}

/**
 * Print the summary and start datetime/date of the next ten events in the
 * authorized user's calendar. If no events are found an appropriate message is
 * printed.
 */
function listUpcomingEvents(userEmail, schemeIds, calendarID, summary, color) {
    var request = gapi.client.calendar.events.list({
        'calendarId': calendarID,
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    });
    request.execute(function (resp) {
        var events = resp.items;
        $.each(events, function (index, event) {
            var when = event.start.dateTime;
            if (!when) {
                when = event.start.date;
            }
            if ($.inArray(event.id, schemeIds) < 0) {
                if (((event.id).indexOf('BIRTHDAY') > -1) && (index < events.length / 2)) {
                    var element = jQuery(".adr_schema:first").clone();
                    element.attr('id', event.id);
                    element.find("#adr_title").html(event.summary);
                    element.find("#adr_description").html(event.description);
                    element.find(".card-action").append('<span id="timestamp" class="badge left light-blue-text">' + when + '</span>');
                    element.find(".card-action").append('<i class="material-icons waves-effect waves-light tooltipped left orange-text" data-position="right" data-delay="50" data-tooltip="1">people</i>');
                    element.find(".card-action").append('<a href="javascript:void(0);" id="addSuggestion"><i class="material-icons waves-effect waves-light right light-blue-text">add_alert</i></a>');
                    element.find(".card-action").append('<a href="javascript:void(0);" id="viewCard"><i class="material-icons waves-effect waves-light right orange-text">launch</i></a>');
                    element.find("#adr_badge").html(summary + ' Calendar').css('color', color);
                    element.find("#rcpts").val(event.gadget.preferences["goo.contactsEmail"]);
                    element.prependTo("#schemes .row").slideDown(1000);
                } else if ((event.id).indexOf('BIRTHDAY') < 0) {
                    var element = jQuery(".adr_schema:first").clone();
                    element.attr('id', event.id);
                    element.find("#adr_title").html(event.summary);
                    element.find("#adr_description").html(event.description);
                    element.find(".card-action").append('<span id="timestamp" class="badge left light-blue-text">' + (event.start.dateTime).split("T")[0] + ' ' + ((event.start.dateTime).split("T")[1]).substring(0, 5) + '</span>');
                    element.find(".card-action").append('<a href="javascript:void(0);" id="addSuggestion"><i class="material-icons waves-effect waves-light right light-blue-text">add_alert</i></a>');
                    element.find(".card-action").append('<a href="javascript:void(0);" id="viewCard"><i class="material-icons waves-effect waves-light right orange-text">launch</i></a>');
                    var guests = [];
                    var i = 0;
                    $.each(event.attendees, function (index, attendee) {
                        if (attendee.email.indexOf(userEmail) < 0) {
                            guests.push(attendee.email);
                            i++;
                        }
                    });
                    element.find(".card-action").append('<i class="material-icons waves-effect waves-light tooltipped left orange-text" data-position="right" data-delay="50" data-tooltip="' + i + '">people</i>');
                    if (calendarID.indexOf('@gmail.com') > -1) {
                        element.find("#adr_badge").html('Primary Calendar').css('color', color);
                    } else {
                        element.find("#adr_badge").html(summary + ' Calendar').css('color', color);
                    }

                    element.find("#rcpts").val(guests);
                    element.prependTo("#schemes .row").slideDown(1000);
                }
                $('.tooltipped').tooltip();
            }
        });
        $('a#addSuggestion').unbind("click").click(function () {
            var card = $(this).parents('.adr_schema');
            $('#addModal').openModal({
                complete: function () {
                    $('#addModal #contacts').val('');
                    $('#addModal #contacts').material_select();
                    $("#addModal #now").prop("checked", true);
                    $("#addModal #calendars").val('0');
                    $('#addModal #calendars').material_select();
                    $("#addModal #subject").val('');
                    $("#addModal #message").val('');
                    updateTime();
                },
                ready: function () {
                    $('#addModal #date, #addModal #time').prop('disabled',
                            $('#addModal #now').is(':checked'));
                    $('#addModal #subject').val(card.find('#adr_title').text()).change();
                    $('#addModal #message').val(card.find('#adr_description').text()).change();
                }
            });
        });
        $('a#editScheme').unbind("click").click(function () {
            var card = $(this).parents('.adr_schema');
            $('#editModal').openModal({
                complete: function () {
                    $('#editModal #contacts').val('');
                    $('#editModal #contacts').material_select();
                    $("#editModal #calendars").val('0');
                    $('#editModal #calendars').material_select();
                    $("#editModal #subject").val('');
                    $("#editModal #message").val('');
//                    updateTime();
                },
                ready: function () {
                    $("#editModal #now").prop("checked", false);
                    $('#editModal #subject').val(card.find('#adr_title').text()).change();
                    $('#editModal #message').val(card.find('#adr_description').text()).change();
                }
            });
        });
        $('a#duplicateScheme').unbind("click").click(function () {
            var card = $(this).parents('.adr_schema');
            $('#copyModal').openModal({
                complete: function () {
                    $("#copyModal #now").prop("checked", true);
                    $("#copyModal #calendars").val('0');
                    $('#copyModal #calendars').material_select();
//                    updateTime();
                },
                ready: function () {
                    $('#copyModal #date, #copyModal #time').prop('disabled',
                            $('#addModal #now').is(':checked'));
                }
            });
        });
        $('a#viewCard').unbind("click").click(function () {
            var card = $(this).parents('.adr_schema');
            var rcpts = card.find('#rcpts').val();
            var rcptsNames = '<br/><ul id="guestsView" class="collection">';
            $.each(rcpts.split(','), function (index, value) {
                rcptsNames += '<li class="collection-item avatar"> <img src="' + $('select#contacts option[value="' + value + '"]').attr("data-icon") + '" alt="" class="circle"> <span class="title">' + $('select#contacts option[value="' + value + '"]').text() + '</span> <p>' + value + '</p></li>';
            });
            rcptsNames += '</ul>';
            $('#viewModal #viewTitle').text(card.find('#adr_title').text());
            $('#viewModal .viewContent').append("<strong>From:</strong> " + card.find('#adr_badge').text() + "<br/><strong>Date range:</strong> " + card.find('#timestamp').attr('data-tooltip') + "<br/><strong>Description:</strong> " + card.find('#adr_description').text() + "<br/><strong>Guests:</strong> " + rcptsNames);
            $('#viewModal').openModal({
                complete: function () {
                    $('#viewModal #viewTitle').empty();
                    $('#viewModal .viewContent').empty();
                }
            });
        });
        $('a#deleteScheme').unbind("click").click(function () {
            var card = $(this).parents('.adr_schema');
            $("#deleteModal #uuid").val(card.attr('id'));
            $('#deleteModal .viewContent').append("Scheme subject:<br/><br/><strong>" + card.find('#adr_title').text() + "</strong><br/><br/>Are you sure you want to delete this scheme?");
            $('#deleteModal').openModal({
                complete: function () {
                    $('#deleteModal .viewContent').empty();
                }
            });
        });
    });

}