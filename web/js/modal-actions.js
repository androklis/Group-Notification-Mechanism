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

//    window.scrollTo(0, 0);
//    $('.progress').toggle();
//
//    var json = {
//        id: $('#uuid').val(),
//        user_email: $.cookie("email"),
//        type: 'ADD'
//    };
//
//    $.post("GNMServlet", {json: json}, function (response, statusText, xhr) {
//        if (xhr.status === 200) {
//        }
//        $('.progress').toggle();
//    });
}