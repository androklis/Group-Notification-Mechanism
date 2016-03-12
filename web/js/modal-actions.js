function delCard() {
    
    window.scrollTo(0, 0);
    
    $('.progress').toggle();
    var id = $('#deleteModal #uuid').val();

    var json = {
        uuid: $('#deleteModal #uuid').val(),
        user_email: $('#deleteModal #email').val(),
        type: 'DELETE'
    };

    $.post("GNMServlet", {json: json}, function (response, statusText, xhr) {
        if (xhr.status === 200) {
            $("div[id=" + id + "]").remove();
        }
        $('.progress').toggle();
    });

}