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

    $('select#adv').on('change', function () {
        if ($('select#adv').val().length > 0) {
//            console.log('.' + $('select#adv').val().join(" ."));
//            $("#schemesContainer").mixItUp('filter', '.' + $('select#adv').val().join(" ."));
        } else {
//            console.log('Empty');
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

    var inputText;
    var $matching = $();

    // Delay function
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $("#search").keyup(function () {
        // Delay function invoked to make sure user stopped typing
        delay(function () {
            $('#schemes').find("div[data-filter='all']").click();
            inputText = $("#search").val().toLowerCase();

            // Check to see if input field is empty
            if ((inputText.length) > 0) {
                $('#schemes .row .adr_schema:not(.suggestion)').each(function () {
                    $this = $("this");

                    // add item to be filtered out if input text matches items inside the title   
                    if ($(this).find('.card-content').text().toLowerCase().match(inputText)) {
                        $matching = $matching.add(this);
                    } else {
                        // removes any previously matched item
                        $matching = $matching.not(this);
                    }
                });
                $("#schemesContainer").mixItUp('filter', $matching);
            } else {
                // resets the filter to show all item if input is empty
                $("#schemesContainer").mixItUp('filter', 'all');
            }
        }, 200);
    });

    $('#clearSearch').click(function () {
        $('#search').val('');
        $('label[for="search"]').removeClass('active');
        $('#search').keyup();
        $("#schemesContainer").mixItUp('filter', 'all');
        $('#schemesContainer').mixItUp('sort', 'timestamp:asc');
    });

    function initComponents() {

        $('.button-collapse').sideNav();

        autoplay();

        $("#moreFilters").hide();
        $(".more").click(function () {
            if ($("#moreFilters").is(':hidden')) {
                $("#moreFilters").slideDown();
                $(".more").html('Show less <i class="material-icons">expand_less</i>');
            } else {
                $("#moreFilters").slideUp();
                $(".more").html('Show more <i class="material-icons">expand_more</i>');
            }
        });

        $('div#index-banner').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);

        $('#schemesContainer').mixItUp({
            callbacks: {
                onMixEnd: function (state) {
                }
            },
            load: {
                page: 1,
                filter: 'all'
            },
            pagination: {
                limit: 12,
                loop: false,
                generatePagers: true,
                maxPagers: 5,
                prevButtonHTML: '<',
                nextButtonHTML: '>'
            }
        });

        $('#date, #startDate, #endDate').pickadate({
            selectMonths: true,
            selectYears: 15,
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE'
        });

        $('#time, #startTime, #endTime').pickatime({
            twelvehour: false,
            default: 'now'
        });

        initDateTime();

    }

    $(window).resize(function () {
        $('div#index-banner').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);
        $('.button-collapse').sideNav('hide');
    });

    $("#contacts").autocomplete({
        lookup: function (query, done) {
            var result = {suggestions: []};

            var d1 = $.get("https://www.google.com/m8/feeds/groups/default/full?alt=json&access_token=" + $.cookie("access_token") + "&v=3.0", function (groupResponse) {
                $.each(groupResponse.feed.entry, function (index, value) {
                    result.suggestions.push({"value": value.title.$t + ' (' + value.title.$t + ')', "data": value.id.$t, "img": "\images/contact_group.png?sz=50"});
                });
            });

            var d2 = $.get("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + $.cookie("access_token") + "&q=" + query + "&max-results=100&v=3.0", function (contactResponse) {
                $.each(contactResponse.feed.entry, function (index, value) {
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
            });

            $.when(d1, d2).done(function () {
                done(result);
            });

        },
        onSelect: function (suggestion) {
            if (suggestion.img === '\images/contact_group.png?sz=50') {
                $.get("https://www.google.com/m8/feeds/contacts/default/full/?alt=json&access_token=" + $.cookie("access_token") + "&group=" + suggestion.data + "&max-results=100",
                        function (response) {
                            $.each(response.feed.entry, function (index, value) {
                                if (value.gd$email) {
                                    if (!document.getElementById(value.gd$email[0].address)) {
                                        if (value.title.$t.length > 0) {
                                            if ((value.title.$t).indexOf('Google+') < 0) {
                                                if (value.link[0].gd$etag) {
                                                    $('.contactsList').append('<div id="' + value.gd$email[0].address + '" class="chip"><img src="' + (value.link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token") + '">' + value.title.$t + ' (' + value.gd$email[0].address.split('@')[1] + ')' + '<i class="material-icons">close</i></div>');
                                                } else {
                                                    $('.contactsList').append('<div id="' + value.gd$email[0].address + '" class="chip"><img src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50">' + value.title.$t + ' (' + value.gd$email[0].address.split('@')[1] + ')' + '<i class="material-icons">close</i></div>');
                                                }
                                            }
                                        } else {
                                            if (value.link[0].gd$etag) {
                                                $('.contactsList').append('<div id="' + value.gd$email[0].address + '" class="chip"><img src="' + (value.link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token") + '">' + value.gd$email[0].address + '<i class="material-icons">close</i></div>');
                                            } else {
                                                $('.contactsList').append('<div id="' + value.gd$email[0].address + '" class="chip"><img src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50">' + value.gd$email[0].address + '<i class="material-icons">close</i></div>');
                                            }
                                        }
                                    }
                                }
                            });
                        });
            } else {
                if (!document.getElementById(suggestion.data)) {
                    $('.contactsList').append('<div id="' + suggestion.data + '" class="chip"><img src="' + suggestion.img + '">' + suggestion.value + '<i class="material-icons">close</i></div>');
                }
            }
            $("#contacts").val('');
            $("#contacts").focus();

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
    $("#addModal #now").prop("checked", true);
    $("select#calendars").val('0');
    $('select#calendars').material_select();
    $('#addModal .contactsList').empty();
    $("#addModal #contacts").val('');
    $("#addModal #subject").val('');
    $("#addModal #message").val('');
    $("#addModal #eventId").val('0');
    $('#addForm .con').css('display', 'none');
    $('#addForm .sub').css('display', 'none');
    $('#addForm .msg').css('display', 'none');
    $("label[for='contacts']").removeClass('active');
    $("label[for='subject']").removeClass('active');
    $("label[for='message']").removeClass('active');
    $('select#calendars').prop('disabled', false);
    $('#addModal #addBtn').removeClass('disabled');
    $('#addModal #eventSettings').addClass('disabled');
    initDateTime();
}

function initDateTime() {
    var today = new Date();
    var day = today.getDate();
    var monthIndex = today.getMonth() + 1;
    var year = today.getFullYear();
    var time = checkTime(today.getHours()) + ':'
            + checkTime(today.getMinutes());

    $('#date').pickadate('picker').set('select', new Date().toISOString().substring(0, 10), {format: 'yyyy-mm-dd'}).set('max', false);
    $('#startDate').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'}).set('max', false);
    $('#endDate').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'}).set('max', false);

    $('#calendarModal #startTime, #calendarModal #endTime').val(time);

    if ($('#addModal #now').is(':checked')) {
        $('#addModal #date').val(year + '-' + monthIndex + '-' + day);
        $('#addModal #time').val(time);
    }
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

function autoplay() {
    $('.carousel').carousel('next');
    setTimeout(autoplay, 4500);
}

function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}