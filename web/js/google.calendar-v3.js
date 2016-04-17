/* global gapi */

/**
 * Load Google Calendar client library. List upcoming events once client library
 * is loaded.
 */
function loadCards(schemes) {
    var schemeIds = [];
    $.each(schemes, function (index, value) {
        createCard(value.uuid, value.calendarid, value.eventid, 'scheme', value.subject, value.message, value.recipients, value.timestamp, value.status, '#ffab40');
        schemeIds.push(value.eventid);
    });

    gapi.client.load('calendar', 'v3', function () {
        var request = gapi.client.calendar.calendarList.list();
        request.execute(function (response) {
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
                    createCard('', calendarID, event.id, 'suggestion', event.summary, description, attendees.join(','), start, resource, color);
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
    element.attr('data-timestamp', timestamp);

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
                element.addClass('pending');
                element.find(".card-action").append('<a href="javascript:void(0);" id="editScheme"><i class="material-icons waves-effect waves-light right black-text">mode_edit</i></a>');
                element.find("#adr_type").html('<i class="material-icons">notifications_active</i>');
            } else if (status === "SENT") {
                element.addClass('sent');
                element.find(".card-action").append('<a href="javascript:void(0);" id="duplicateScheme"><i class="material-icons waves-effect waves-light right black-text">content_copy</i></a>');
                element.find("#adr_type").html('<i class="material-icons">notifications_off</i>');
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
            element.find('.card').css('border', '1px solid ' + color.split("@")[0]);

            if (className === "birthday") {
                element.find("#adr_type").html('<i class="material-icons">cake</i>');
                element.addClass('suggestion');
            } else if (className === "holiday") {
                element.find("#adr_type").html('<i class="material-icons">airplanemode_active</i>');
                element.addClass('suggestion');
            } else if (className === "weather") {
                element.find("#adr_type").html('<img src="' + color.split("@")[1] + '" class="material-icons" width="24" heigth="24"/>');
                element.addClass('suggestion');
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
        var rcpts = card.find('#rcpts').val();
        $.each(rcpts.split(','), function (index, value) {
            $.get("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + $.cookie("access_token") + "&q=" + value + "&max-results=100&v=3.0", function (response) {
                if (response.feed.entry[0].gd$email) {
                    if (response.feed.entry[0].title.$t.length > 0) {
                        if ((response.feed.entry[0].title.$t).indexOf('Google+') < 0) {
                            if (response.feed.entry[0].link[0].gd$etag) {
                                $('#addModal .contactsList').append('<div id="' + response.feed.entry[0].gd$email[0].address + '" class="chip"><img src="' + (response.feed.entry[0].link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token") + '">' + response.feed.entry[0].title.$t + '<i class="material-icons">close</i></div>');
                            } else {
                                $('#addModal .contactsList').append('<div id="' + response.feed.entry[0].gd$email[0].address + '" class="chip"><img src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50">' + response.feed.entry[0].title.$t + '<i class="material-icons">close</i></div>');
                            }
                        }
                    } else {
                        if (response.feed.entry[0].link[0].gd$etag) {
                            $('#addModal .contactsList').append('<div id="' + response.feed.entry[0].gd$email[0].address + '" class="chip"><img src="' + (response.feed.entry[0].link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token") + '">' + response.feed.entry[0].gd$email[0].address + '<i class="material-icons">close</i></div>');
                        } else {
                            $('#addModal .contactsList').append('<div id="' + response.feed.entry[0].gd$email[0].address + '" class="chip"><img src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50">' + response.feed.entry[0].gd$email[0].address + '<i class="material-icons">close</i></div>');
                        }
                    }
                }
            });
        });
        $('select#calendars').val($('select#calendars option:contains("' + card.find('#adr_badge').text() + '")').val());
        $('select#calendars').prop('disabled', true);
        $('select#calendars').material_select();
        picker.set('max', card.find('#timestamp').text(), {format: 'yyyy-mm-dd'});
        $('#addModal #date, #addModal #time').prop('disabled',
                $('#addModal #now').is(':checked'));
        $('#addModal #subject').val(card.find('#adr_title').text()).change();
        $('#addModal #message').val(card.find('#adr_description').text()).change();
        $('#addModal #eventId').val(card.attr('id'));
        $('#addModal').openModal({
            complete: function () {
                onModalComplete();
            },
            ready: function () {
            }
        });
    });

    $('a#editScheme').unbind("click").click(function () {
        var card = $(this).parents('.adr_schema');
        $('#addModal #addBtn').attr('onclick', 'updateCard();');
        $('#addModal #addBtn').text('Update');
        $('#addModal #schemeTitle').text(card.find('#adr_title').text());

        var rcpts = card.find('#rcpts').val();
        $.each(rcpts.split(','), function (index, value) {
            $.get("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + $.cookie("access_token") + "&q=" + value + "&max-results=100&v=3.0", function (response) {
                if (response.feed.entry[0].gd$email) {
                    if (response.feed.entry[0].title.$t.length > 0) {
                        if ((response.feed.entry[0].title.$t).indexOf('Google+') < 0) {
                            if (response.feed.entry[0].link[0].gd$etag) {
                                $('#addModal .contactsList').append('<div id="' + response.feed.entry[0].gd$email[0].address + '" class="chip"><img src="' + (response.feed.entry[0].link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token") + '">' + response.feed.entry[0].title.$t + '<i class="material-icons">close</i></div>');
                            } else {
                                $('#addModal .contactsList').append('<div id="' + response.feed.entry[0].gd$email[0].address + '" class="chip"><img src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50">' + response.feed.entry[0].title.$t + '<i class="material-icons">close</i></div>');
                            }
                        }
                    } else {
                        if (response.feed.entry[0].link[0].gd$etag) {
                            $('#addModal .contactsList').append('<div id="' + response.feed.entry[0].gd$email[0].address + '" class="chip"><img src="' + (response.feed.entry[0].link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token") + '">' + response.feed.entry[0].gd$email[0].address + '<i class="material-icons">close</i></div>');
                        } else {
                            $('#addModal .contactsList').append('<div id="' + response.feed.entry[0].gd$email[0].address + '" class="chip"><img src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50">' + response.feed.entry[0].gd$email[0].address + '<i class="material-icons">close</i></div>');
                        }
                    }
                }
            });
        });
        $('select#calendars').val(card.find('#calendarId').val());
        if (card.find('#calendarId').val() !== '0') {
            var datepicker = $('#date').pickadate({});
            var picker = datepicker.pickadate('picker');
            picker.set('max', (card.find('#timestamp').text()).split(' ')[0], {format: 'yyyy-mm-dd'});
            $('select#calendars').prop('disabled', true);
        }
        $('select#calendars').material_select();

        $('#addModal #date, #addModal #time').prop('disabled',
                $('#addModal #now').is(':checked'));
        $('#addModal #subject').val(card.find('#adr_title').text()).change();
        $('#addModal #message').val(card.find('#adr_description').text()).change();
        $('#addModal #eventId').val(card.attr('id'));
        $('#addModal').openModal({
            complete: function () {
                $('#addModal #addBtn').attr('onclick', 'addCard();');
                $('#addModal #addBtn').text('Add');
                $('#addModal #schemeTitle').text('Add new Scheme');
                onModalComplete();
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
        $('#viewModal #viewTitle').text(card.find('#adr_title').text());
        if (card.hasClass('suggestion')) {
            $('#viewModal .viewContent .resource').append(card.find('#adr_badge').text());
            $('#viewModal .viewContent #rsc').html('SUGGESTION');
        } else {
            $('#viewModal .viewContent .resource').append('GROUP NOTIFICATION SCHEMES');
            $('#viewModal .viewContent #rsc').html(card.find('#adr_badge').text());
        }

        $('#viewModal .viewContent .dateRange').append(card.find('#timestamp').text());
        $('#viewModal .viewContent .desc').append(card.find('#adr_description').html());
        $('#viewModal .viewContent #attendeesCnt').html(card.find('.card-action i.tooltipped').data('tooltip'));

        $.each(rcpts.split(','), function (index, value) {
            if (value !== "") {
                $.getJSON("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + encodeURIComponent($.cookie("access_token")) + "&q=" + value + "&max-results=1&v=3.0").then(function (response) {
                    if (response.feed.entry) {
                        if (response.feed.entry[0].title.$t.length > 0) {
                            if (response.feed.entry[0].link[0].gd$etag) {
                                $('#viewModal .viewContent .attendees').append("<div class='chip'><img src='" + (response.feed.entry[0].link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token") + "' alt=''>" + response.feed.entry[0].title.$t + " (" + value.split('@')[1] + ")</div>");
                            } else {
                                $('#viewModal .viewContent .attendees').append("<div class='chip'><img src='https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50' alt=''>" + response.feed.entry[0].title.$t + " (" + value.split('@')[1] + ")</div>");
                            }
                        } else {
                            if (response.feed.entry[0].link[0].gd$etag) {
                                $('#viewModal .viewContent .attendees').append("<div class='chip'><img src='" + (response.feed.entry[0].link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token") + "' alt=''>" + value + "</div>");
                            } else {
                                $('#viewModal .viewContent .attendees').append("<div class='chip'><img src='https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50' alt=''>" + value + "</div>");
                            }
                        }
                    } else {
                        $('#viewModal .viewContent .attendees').append("<div class='chip'><img src='https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50' alt=''>" + value + "</div>");
                    }
                }, function (error) {
                    $('#viewModal .viewContent .attendees').append("<div class='chip'><img src='https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50' alt=''>" + value + "</div>");
                });
            } else {
                $('#viewModal .viewContent .attendees').append("<div class='chip'><img src='https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50' alt=''>" + value + "</div>");
            }
        });

        $('#viewModal').openModal({
            complete: function () {
                $('#viewModal #viewTitle').empty();
                $('#viewModal .viewContent .resource').empty();
                $('#viewModal .viewContent .dateRange').empty();
                $('#viewModal .viewContent .desc').empty();
                $('#viewModal .viewContent .attendees').empty();
                $('#viewModal .viewContent #attendeesCnt').html('');
                $('#viewModal .viewContent #rsc').html('');
                collapseAll();
            },
            ready: function () {
                $('#attPeople.collapsible').collapsible({});
                expandAll();
            }
        });

    });
    $('a#deleteScheme').unbind("click").click(function () {
        var card = $(this).parents('.adr_schema');
        $('#uuid').val(card.attr('id'));
        $('#deleteModal .viewContent').append("Scheme subject:&nbsp;&nbsp;<strong>\"" + card.find('#adr_title').text() + "\"</strong><br/><br/>Are you sure you want to delete this scheme?");
        $('#deleteModal').openModal({
            complete: function () {
                $('#deleteModal .viewContent').empty();
            }
        });
    });
    $('.tooltipped').tooltip();

    $('#schemesContainer').mixItUp('paginate', {
        page: 1,
        limit: 12
    });
//    $('#schemesContainer').mixItUp('sort', 'timestamp:asc');
}