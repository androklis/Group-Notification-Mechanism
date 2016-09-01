var today = new Date();
var time = checkTime(today.getHours()) + ':'
        + checkTime(today.getMinutes());
setInterval(function () {
    time = checkTime(today.getHours()) + ':'
            + checkTime(today.getMinutes());
}, 30000);

$(function () {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);

    initComponents();
    addFormRules();

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
        var $match = $();
        if ($('select#adv').val().length === 0) {
            $("#schemesContainer").mixItUp('filter', 'all');
        } else {
            $.each($('select#adv').val(), function (index, value) {
                $('#schemes .row .adr_schema:not(.suggestion)').each(function () {
                    $this = $("this");
                    if ($(this).find('#calendarId').val().match(value)) {
                        $match = $match.add(this);
                    }
                });
            });
            $("#schemesContainer").mixItUp('filter', $match);
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
        $('#addModal #date, #addModal #time').prop('disabled', $('#addModal #now').is(':checked'));
        if ($('#addModal #now').is(':checked')) {
            initDateTime();
        }
    });

    $('#copyModal #cpNow').click(function () {
        $('#copyModal #cpDate, #copyModal #cpTime').prop('disabled', $('#copyModal #cpNow').is(':checked'));
        if ($('#copyModal #cpNow').is(':checked')) {
            initDateTime();
        }
    });

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
        $('#schemesContainer').mixItUp('sort', 'timestamp:desc');
    });

    function initComponents() {

        $('.button-collapse').sideNav();

        $('#message').froalaEditor({
            placeholderText: 'Enter a Message',
            enter: $.FroalaEditor.ENTER_BR,
            htmlAllowComments: false,
            quickInsertButtons: [],
            heightMin: 200,
            toolbarSticky: false,
            toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', '-', 'outdent', 'indent', 'quote', 'insertHR', 'insertLink', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
            toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '-', 'fontFamily', 'fontSize', 'color', 'paragraphFormat', 'align', '-', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', 'insertLink', 'insertTable', '-', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
            toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '-', 'fontFamily', 'fontSize', 'color', 'paragraphFormat', 'align', '-', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', 'insertLink', 'insertTable', '-', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
            toolbarButtonsXS: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '-', 'fontFamily', 'fontSize', 'color', 'paragraphFormat', 'align', '-', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', 'insertLink', 'insertTable', '-', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
            charCounterCount: true
        });

        $('.fr-placeholder').css({'font-size': '15px',
            'line-height': '22.5px',
            'margin-top': '0px',
            'padding-top': '10px',
            'padding-left': '10px',
            'margin-left': '0px',
            'height': '170px'});

        $('[data-cmd="outdent"]').addClass('fr-disabled');

        $("#owl").owlCarousel({
            // Most important owl features
            items: 4,
            itemsCustom: false,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [980, 3],
            itemsTablet: [768, 2],
            itemsTabletSmall: false,
            itemsMobile: [479, 1],
            singleItem: false,
            itemsScaleUp: false,
            //Basic Speeds
            slideSpeed: 200,
            paginationSpeed: 800,
            rewindSpeed: 1000,
            //Autoplay
            autoPlay: true,
            stopOnHover: true,
            // Navigation
            navigation: false,
            navigationText: ["prev", "next"],
            rewindNav: true,
            scrollPerPage: false,
            //Pagination
            pagination: true,
            paginationNumbers: false,
            // Responsive 
            responsive: true,
            responsiveRefreshRate: 200,
            responsiveBaseWidth: window,
            // CSS Styles
            baseClass: "owl-carousel",
            theme: "owl-theme",
            //Lazy load
            lazyLoad: false,
            lazyFollow: true,
            lazyEffect: "fade",
            //Auto height
            autoHeight: false,
            //JSON 
            jsonPath: false,
            jsonSuccess: false,
            //Mouse Events
            dragBeforeAnimFinish: true,
            mouseDrag: true,
            touchDrag: true,
            //Transitions
            transitionStyle: false,
            // Other
            addClassActive: false,
            //Callbacks
            beforeUpdate: false,
            afterUpdate: false,
            beforeInit: false,
            afterInit: false,
            beforeMove: false,
            afterMove: false,
            afterAction: false,
            startDragging: false,
            afterLazyLoad: false
        });

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
                limit: 8,
                loop: false,
                generatePagers: true,
                maxPagers: 5,
                prevButtonHTML: '<',
                nextButtonHTML: '>'
            }
        });

        $('#date').pickadate({
            selectMonths: true,
            selectYears: 15,
            container: 'body',
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE'
        });

        $('#cpDate').pickadate({
            selectMonths: true,
            selectYears: 15,
            container: 'body',
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE'
        });

        $('#endDate').pickadate({
            selectMonths: true,
            selectYears: 15,
            container: 'body',
            min: new Date((new Date()).valueOf() + 1000 * 3600 * 24),
            today: '',
            format: 'yyyy-mm-dd',
            clear: '',
            close: 'DONE'
        });

        $('#startDate').pickadate({
            selectMonths: true,
            selectYears: 15,
            container: 'body',
            min: true,
            format: 'yyyy-mm-dd',
            today: 'TODAY',
            clear: '',
            close: 'DONE',
            onSet: function () {
//                $('#endDate').pickadate('picker').set('min', new Date((new Date(($('#startDate').val()))).valueOf() + 1000 * 3600 * 24));
//                $('#endDate').pickadate('picker').set('select', new Date((new Date(($('#startDate').val()))).valueOf() + 1000 * 3600 * 24));
                $('#endDate').pickadate('picker').set('min', new Date((new Date(($('#startDate').val()))).valueOf()));
                $('#endDate').pickadate('picker').set('select', new Date((new Date(($('#startDate').val()))).valueOf()));
            }
        });

        var time = $('#time, #cpTime').pickatime({
            twelvehour: false,
            autoclose: true,
            vibrate: true,
            default: 'now',
            beforeShow: function () {
                $('.clockpicker.picker').detach().appendTo('body');
            }
        });

        var startTime = $('#startTime').pickatime({
            twelvehour: false,
            autoclose: true,
            vibrate: true,
            default: 'now',
            beforeShow: function () {
                $('.clockpicker.picker').detach().appendTo('body');
            }, afterDone: function () {
                var hh = parseInt($('#calendarModal #startTime').val().split(':')[0]) + 1;

                if (hh < 10 && hh > -1) {
                    $('#calendarModal #endTime').val('0' + hh.toString() + ':' + $('#calendarModal #startTime').val().split(':')[1]);
                } else {
                    $('#calendarModal #endTime').val(hh.toString() + ':' + $('#calendarModal #startTime').val().split(':')[1]);
                }
            }
        });

        var endTime = $('#endTime').pickatime({
            twelvehour: false,
            autoclose: true,
            vibrate: true,
            default: 'now',
            beforeShow: function () {
                $('.clockpicker.picker').detach().appendTo('body');
            }
        });

        time.pickatime('show');
        time.pickatime('hide');
        startTime.pickatime('show');
        startTime.pickatime('hide');
        endTime.pickatime('show');
        endTime.pickatime('hide');

        initDateTime();

    }

    $(window).resize(function () {
        $('div#index-banner').css('min-height', ($(window).height() - $('#footer').height() - $('#footer').height() - $('nav.light-blue.lighten-1').height()) + 10);
        $('.button-collapse').sideNav('hide');
    });

    $("#contacts").keyup(function (e) {

        var input = $("#contacts").val();
        var code = e.which;

        if ((input.length) > 0) {
            if (code === 13) {
                $('#addForm .con2').css('display', 'none');
                if (validateEmail(input)) {
                    if (!document.getElementById(input)) {
                        $.get("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + $.cookie("access_token") + "&q=" + input + "&max-results=100&v=3.0", function (contactResponse) {
                            if (contactResponse.feed.entry) {
                                $.each(contactResponse.feed.entry, function (index, value) {
                                    if (value.gd$email) {
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
                                });
                            } else {
                                $('.contactsList').append('<div id="' + input + '" class="chip"><img src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50">' + input + '<i class="material-icons">close</i></div>');
                            }
                        });
                    }
                } else {
                    $('#addForm .con2').css('display', 'block');
                }
                $("#contacts").val('');
                $("#contacts").focus();
                $('#addForm .con').css('display', 'none');
            }
        }
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
                                if (!$('#addForm .contactsList').is(':empty')) {
                                    $('#addForm .con').css('display', 'none');
                                } else {
                                    $('#addForm .con').css('display', 'block');
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
    $('#addModal #schemeTitle').text('Add new Scheme');
    $('#addModal #addBtn').text('Add');
    $("#addModal #now").prop("checked", true);
    $("select#calendars").val('0');
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
    $('select#calendars').material_select();
    $('#addModal #addBtn').removeClass('disabled');
    $('#addModal #eventSettings').addClass('disabled');
    $('#message').froalaEditor('html.set', '');
    $('.fr-placeholder').css({'font-size': '15px',
        'line-height': '22.5px',
        'margin-top': '0px',
        'padding-top': '10px',
        'padding-left': '10px',
        'margin-left': '0px',
        'height': '170px'});
    $('#message').froalaEditor('charCounter.count');
    initDateTime();
}

function initDateTime() {
    $('#date').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'}).set('max', false);
    $('#cpDate').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'}).set('max', false);
    $('#startDate').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'}).set('max', false);
    $('#endDate').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'}).set('max', false);

    $('#calendarModal #startTime, #copyModal #cpTime').val(time);

    var hh = parseInt($('#calendarModal #startTime').val().split(':')[0]) + 1;

    if (hh < 10 && hh > -1) {
        $('#calendarModal #endTime').val('0' + hh.toString() + ':' + $('#calendarModal #startTime').val().split(':')[1]);
    } else {
        $('#calendarModal #endTime').val(hh.toString() + ':' + $('#calendarModal #startTime').val().split(':')[1]);
    }

    if ($('#addModal #now').is(':checked')) {
        $('#date').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'}).set('max', false);
        $('#addModal #time').val(time);
    }

    if ($('#copyModal #cpNow').is(':checked')) {
        $('#cpDate').pickadate('picker').set('select', new Date().toLocaleString().substring(0, 10), {format: 'yyyy-mm-dd'}).set('max', false);
        $('#copyModal #cpTime').val(time);
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

function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}