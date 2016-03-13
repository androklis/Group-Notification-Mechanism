function fetchContacts() {

    $.get("https://www.google.com/m8/feeds/groups/default/full?alt=json&access_token=" + $.cookie("access_token") + "&v=3.0",
            function (response) {
                $.each(response.feed.entry, function (index, value) {
                    $('select#contacts').append($('<option value="' + value.id.$t + '" data-icon="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50" class="left circle">' + value.title.$t + '</option>'));
                });
                $('select#contacts').material_select();
            });
    $.get("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + $.cookie("access_token") + "&max-results=100&v=3.0",
            function (response) {
                $.each(response.feed.entry, function (index, value) {
                    if (value.link[0].gd$etag) {
                        $('select#contacts').append($('<option value="' + value.gd$email[0].address + '" data-icon="' + (value.link[0].href).replace('?v=3.0', '').trim() + "?access_token=" + $.cookie("access_token") + '" class="left circle">' + value.title.$t + '</option>'));
                    } else {
                        $('select#contacts').append($('<option value="' + value.gd$email[0].address + '" data-icon="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50" class="left circle">' + value.title.$t + '</option>'));
                    }
                });
                $('select#contacts').material_select();
            });
}

function fetchGroupContacts(groupId) {
    $.get("https://www.google.com/m8/feeds/contacts/default/full/?alt=json&access_token=" + $.cookie("access_token") + "&group=" + groupId + "&max-results=100",
            function (response) {
                $.each(response.feed.entry, function (index, value) {
                    console.log(value.gd$email[0].address);
                });
            });
}