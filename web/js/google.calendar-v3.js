/* global gapi */

/**
 * Load Google Calendar client library. List upcoming events once client library
 * is loaded.
 */
function loadCards(schemes) {
    console.log(schemes);
    var schemeIds = [];
    $.each(schemes, function (index, value) {
        createCard(value.uuid, value.calendarid, value.eventid, 'scheme', value.subject, value.message, value.recipients, value.timestamp, value.status, '#ffab40');
        schemeIds.push(value.eventid);
    });
    
    gapi.client.load('calendar', 'v3', function () {
        var request = gapi.client.calendar.calendarList.list();
        request.execute(function (response) {
            console.log('CALENDARS', response);
            $.each(response.items, function (index, value) {
                if (value.primary) {
                    $('select#calendars').append('<option value="' + value.id + '">PRIMARY CALENDAR</option>');
                } else {
                    if (!/calendar/i.test(value.summary.toUpperCase())) {
                        if (value.accessRole.indexOf('reader') > -1) {
                            $('select#calendars').append('<option value="' + value.id + '" disabled>' + value.summary.toUpperCase() + ' CALENDAR</option>');
                        } else if ((value.accessRole.indexOf('writer') > -1) || (value.accessRole.indexOf('owner') > -1)) {
                            $('select#calendars').append('<option value="' + value.id + '">' + value.summary.toUpperCase() + ' CALENDAR</option>');
                        } else if ((value.accessRole.indexOf('none') > -1) || (value.accessRole.indexOf('freeBusyReader') > -1)) {
                            return;
                        }
                    } else {
                        if (value.accessRole.indexOf('reader') > -1) {
                            $('select#calendars').append('<option value="' + value.id + '" disabled>' + value.summary.toUpperCase() + '</option>');
                        } else if ((value.accessRole.indexOf('writer') > -1) || (value.accessRole.indexOf('owner') > -1)) {
                            $('select#calendars').append('<option value="' + value.id + '">' + value.summary.toUpperCase() + '</option>');
                        } else if ((value.accessRole.indexOf('none') > -1) || (value.accessRole.indexOf('freeBusyReader') > -1)) {
                            return;
                        }
                    }
                }
                listUpcomingEvents(schemeIds, value.id, value.summary, value.backgroundColor);
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
function listUpcomingEvents(schemeIds, calendarID, summary, color) {
    var request = gapi.client.calendar.events.list({
        'calendarId': calendarID,
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    });
    request.execute(function (response) {
        console.log('EVENTS', response);
        var events = response.items;
        $.each(events, function (index, event) {
            var when = event.start.dateTime;
            if (!when) {
                when = event.start.date;
            }
            if ($.inArray(event.id, schemeIds) < 0) {
                if ((event.id).indexOf('BIRTHDAY') > -1) {
                    if (event.gadget.preferences["goo.contactsEmail"]) {
                        createCard('', calendarID, event.id, 'birthday', event.summary, event.description, event.gadget.preferences["goo.contactsEmail"], event.start.date, summary + ' Calendar', color);
                    } else {
                        createCard('', calendarID, event.id, 'birthday', event.summary, event.description, "", event.start.date, summary + ' Calendar', color);
                    }
                } else if (calendarID.indexOf('#holiday@') > -1) {
                    createCard('', calendarID, event.id, 'holiday', event.summary, event.summary, "", event.start.date, summary + ' Calendar', color);
                } else if (calendarID.indexOf('#weather@') > -1) {
                    createCard('', calendarID, event.id, 'weather', event.summary, event.summary, "", event.start.date, summary + ' Calendar', color + '@' + event.gadget.iconLink);
                } else {

                    var attendees = [];
                    var start = "";
                    var description = "";
                    var resource = "";

                    if (event.attendees) {
                        $.each(event.attendees, function (index, attendee) {
                            attendees.push(attendee.email);
                        });
                    }

                    if (event.start.dateTime) {
                        start = (event.start.dateTime).split("T")[0] + ' ' + ((event.start.dateTime).split("T")[1]).substring(0, 5);
                    } else {
                        start = event.start.date;
                    }

                    if (event.description) {
                        description = event.description;
                    } else {
                        description = event.summary;
                    }

                    if (calendarID.indexOf($.cookie("email")) > -1) {
                        resource = "Primary Calendar";
                    } else {
                        if (/calendar/i.test(summary)) {
                            resource = summary;
                        } else {
                            resource = summary + ' Calendar';
                        }
                    }

                    createCard('', calendarID, event.id, 'calendar', event.summary, description, attendees.join(','), start, resource, color);

                }
            }
        });
    });
}

function createCard(uuid, calendarId, eventId, className, title, content, recipients, timestamp, status, color) {

    var element = jQuery(".adr_schema:first").clone();
    element.find("#calendarId").val(calendarId);
    element.find("#eventId").val(eventId);
    element.addClass(className);
    element.find("#adr_title").html(title);
    element.find("#adr_description").html(content);
    element.find(".card-action").append('<span id="timestamp" class="badge left light-blue-text">' + timestamp + '</span>');

    var guests = [];
    var i = 0;

    if (recipients.length > 0) {
        $.each(recipients.split(','), function (index, attendee) {
            if (attendee.indexOf($.cookie("email")) < 0) {
                guests.push(attendee);
                i++;
            }
        });
    }

    switch (className) {
        case "scheme":
            element.attr('id', uuid);
            element.find(".card-action").append('<a href="javascript:void(0);" id="deleteScheme"><i class="material-icons waves-effect waves-light right red-text">delete_forever</i></a>');
            if (status === "PENDING") {
                element.find(".card-action").append('<a href="javascript:void(0);" id="editScheme"><i class="material-icons waves-effect waves-light right black-text">mode_edit</i></a>');
                element.find("#adr_type").html('<i class="material-icons">notifications_active</i>');
            } else {
                element.find(".card-action").append('<a href="javascript:void(0);" id="duplicateScheme"><i class="material-icons waves-effect waves-light right black-text">content_copy</i></a>');
                element.find("#adr_type").html('<i class="material-icons">notifications_off</i>');
            }
            element.find("#rcpts").val(guests);
            element.find(".card-action").append('<a href="javascript:void(0);" id="viewCard"><i class="material-icons waves-effect waves-light right orange-text">launch</i></a>');
            element.find(".card-action").append('<i class="material-icons waves-effect waves-light tooltipped right orange-text" data-position="left" data-delay="50" data-tooltip="' + i + '">people</i>');
            element.find("#adr_badge").html(status).css('color', color);
            element.appendTo("#schemes #schemesContainer.row").slideDown(1000);
            break;
        default:
            element.attr('id', eventId);
            element.find(".card-action").append('<a href="javascript:void(0);" id="addSuggestion"><i class="material-icons waves-effect waves-light right light-blue-text">add_alert</i></a>');
            element.find("#rcpts").val(guests);
            element.find(".card-action").append('<a href="javascript:void(0);" id="viewCard"><i class="material-icons waves-effect waves-light right orange-text">launch</i></a>');
            element.find(".card-action").append('<i class="material-icons waves-effect waves-light tooltipped right orange-text" data-position="left" data-delay="50" data-tooltip="' + i + '">people</i>');
            element.find("#adr_badge").html(status.toUpperCase()).css('color', color.split("@")[0]);

            if (className === "birthday") {
                element.find("#adr_type").html('<i class="material-icons">cake</i>');
                element.addClass('calendar');
            } else if (className === "holiday") {
                element.find("#adr_type").html('<i class="material-icons">airplanemode_active</i>');
                element.addClass('calendar');
            } else if (className === "weather") {
                element.find("#adr_type").html('<img src="' + color.split("@")[1] + '" class="material-icons" width="24" heigth="24"/>');
                element.addClass('calendar');
            } else {
                element.find("#adr_type").html('<i class="material-icons">event</i>');
            }

            element.prependTo("#schemes #schemesContainer.row").slideDown(1000);
            break;
    }

    $('a#addSuggestion').unbind("click").click(function () {
        var card = $(this).parents('.adr_schema');
        var datepicker = $('#date').pickadate({});
        var picker = datepicker.pickadate('picker');
        $('#addModal').openModal({
            complete: function () {
                $("#addModal #now").prop("checked", true);
                picker.set('max', '');
                picker.set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'});
                $('select#calendars').prop('disabled', false);
                $("#addModal #calendars").val('0');
                $('#addModal #calendars').material_select();
                $("#addModal #subject").val('');
                $("#addModal #message").val('');
                $('#addModal #eventId').val('0');
            },
            ready: function () {
                $('select#calendars').val($('select#calendars option:contains("' + card.find('#adr_badge').text() + '")').val());
                $('select#calendars').prop('disabled', true);
                $('select#calendars').material_select();
                picker.set('max', card.find('#timestamp').text(), {format: 'yyyy-mm-dd'});
                $('#addModal #date, #addModal #time').prop('disabled',
                        $('#addModal #now').is(':checked'));
                $('#addModal #subject').val(card.find('#adr_title').text()).change();
                $('#addModal #message').val(card.find('#adr_description').text()).change();
                $('#addModal #eventId').val(card.attr('id'));
            }
        });
    });

    $('a#editScheme').unbind("click").click(function () {
        var card = $(this).parents('.adr_schema');
        $('#editModal').openModal({
            complete: function () {

            },
            ready: function () {

            }
        });
    });

    $('a#duplicateScheme').unbind("click").click(function () {
        var card = $(this).parents('.adr_schema');
        $('#copyModal').openModal({
            complete: function () {

            },
            ready: function () {

            }
        });
    });

    $('a#viewCard').unbind("click").click(function () {
        var card = $(this).parents('.adr_schema');
        var rcpts = card.find('#rcpts').val();
        var rcptsNames = $('<ul></ul>');
        rcptsNames.attr('id', 'guestsView');
        rcptsNames.addClass('collection');
        $.each(rcpts.split(','), function (index, value) {
            var img = "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50";
            var title = "NO GUESTS";
            if (value !== "") {
                $.get("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + $.cookie("access_token") + "&q=" + value + "&max-results=1&v=3.0",
                        function (response) {
                            if (response.feed.entry) {
                                if (response.feed.entry[0].title.$t.length > 0) {
                                    title = response.feed.entry[0].title.$t;
                                }
                                if (response.feed.entry[0].link[0].gd$etag) {
                                    img = (response.feed.entry[0].link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token");
                                }
                            } else {
                                title = "NOT FOUND";
                            }
                            rcptsNames.append('<li class="collection-item avatar"> <img src="' + img + '" alt="" class="circle"> <span class="title">' + title + '</span> <p>' + value + '</p></li>');
                        });
            } else {
                rcptsNames.append('<li class="collection-item avatar"> <img src="' + img + '" alt="" class="circle"> <span class="title">' + title + '</span> <p>' + value + '<br/></p></li>');
            }
        });
        $('#viewModal #viewTitle').text(card.find('#adr_title').text());
        $('#viewModal .viewContent').append("<strong>From:</strong> " + card.find('#adr_badge').text() + "<br/><strong>Timestamp:</strong> " + card.find('#timestamp').text() + "<br/><strong>Description:</strong> " + card.find('#adr_description').text() + "<br/><strong>Guests:</strong><br/>");
        $('#viewModal .viewContent').append(rcptsNames);
        $('#viewModal').openModal({
            complete: function () {
                $('#viewModal #viewTitle').empty();
                $('#viewModal .viewContent').empty();
            }
        });
    });
    $('a#deleteScheme').unbind("click").click(function () {
        var card = $(this).parents('.adr_schema');
        $('#uuid').val(card.attr('id'));
        $('#deleteModal .viewContent').append("Scheme subject:<br/><br/><strong>" + card.find('#adr_title').text() + "</strong><br/><br/>Are you sure you want to delete this scheme?");
        $('#deleteModal').openModal({
            complete: function () {
                $('#deleteModal .viewContent').empty();
            }
        });
    });
    $('.tooltipped').tooltip();
}