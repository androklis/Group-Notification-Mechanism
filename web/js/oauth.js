/* global gapi */

function render() {
    gapi.signin.render('customBtn', {
        'callback': "signinCallback",
        'clientid': "1011063897948-bnght07vjm51m6c3tllmnc2vbo6op2cj.apps.googleusercontent.com",
        'cookiepolicy': "single_host_origin",
        'scope': "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/contacts.readonly https://mail.google.com/ https://www.googleapis.com/auth/calendar",
        'accesstype': "offline"
    });
}

function signinCallback(authResult) {
    if (authResult) {
        if (authResult['status']['signed_in']) {

            togglePage('signedIn');
            fetchContacts(authResult['access_token']);
            updateProfileInfo(authResult['code']);

        } else if (authResult['status']['immediate_failed']) {
            togglePage('signedOut');
        } else if (authResult['status']['access_denied']) {
            togglePage('signedOut');
        } else if (authResult['status']['user_signed_out']) {
            togglePage('signedOut');
        } else {
            togglePage('signedOut');
        }
    }

}

function updateProfileInfo(code) {
    gapi.client.load('plus', 'v1', function () {
        var request = gapi.client.plus.people.get({'userId': 'me'});
        request.execute(function (response) {

            var name;
            var img;

            if ((!response.name && response.givenName) && response.family_name) {
                name = response.givenName + ' ' + response.family_name;
            } else if ((response.name && !response.givenName) && response.family_name) {
                name = response.name + ' ' + response.family_name;
            } else if (response.displayName) {
                name = response.displayName;
            }
            if (response.image && response.image.url) {
                img = response.image.url;
            }

            $('#user').append('<ul id="userDropdown" class="dropdown-content waves-effect waves-light"><li><a href="#!" class="light-blue-text" onclick="signOut();">Sign Out</a></li></ul>');
            $('#user').append('<li><a href="javascript:void(0);" id="" class="waves-effect waves-light"><i class="material-icons">settings</i></a></li>');
            $('#user').append('<li><a class="dropdown-button waves-effect waves-light" href="#!" data-activates="userDropdown"><img alt="" src="' + img + '" style="vertical-align: middle; border-radius: 25px; width:50px; height:50px;"/>&nbsp;&nbsp;' + name + '<i class="material-icons right">arrow_drop_down</i></a></li>');

            $('#nav-mobile').append('<li style="text-align: center;"><img alt="" src="' + img + '" style="vertical-align: middle; border-radius: 25px; width:50px; height:50px;"/></li><li style="color: black; text-align: center;"><strong>' + name + '</strong></li><li style="text-align: center;"><a href="javascript:void(0);" id="" class="waves-effect waves-light">Settings</a></li><li style="text-align: center;"><a href="#!" class="waves-effect waves-light light-blue-text" onclick="signOut();">Sign Out</a></li>');

            $(".dropdown-button").dropdown({
                hover: true,
                belowOrigin: true
            });

            $('*[id*=email]').each(function () {
                $(this).val(response.emails[0].value);
            });

            servletCall(code, response.emails[0].value);
        });
    });
}

function servletCall(code, email) {

    var json = {
        auth_code: code,
        user_email: email
    };

    $.ajax({
        url: "Auth2Servlet",
        type: "POST",
        dataType: 'json',
        data: {
            json: json
        },
        success: function (data) {
            loadCards(email, data.schemes);
            $('#spinnerContainer').attr('style', 'display: none');
        },
        error: function (error) {
            console.error('ERROR:', error);
        }
    });
}

function signOut() {
    gapi.auth.signOut();
    $('.button-collapse').sideNav('hide');
    togglePage('signedOut');
}

function togglePage(status) {
    switch (status) {
        case "signedIn":
            $('#welcomeScreen').attr('style', 'display: none');
            $('#spinnerContainer').attr('style', 'display: block');
            $('#schemes').attr('style', 'display: block');
            $('#user').attr('style', 'display: block');
            $('.fixed-action-btn').attr('style', 'display: block');
            break;
        case "signedOut":
            $('#welcomeScreen').attr('style', 'display: block');
            $('#schemes').attr('style', 'display: none');
            $('#user').attr('style', 'display: none');
            $('.fixed-action-btn').attr('style', 'display: none');
            $('#spinnerContainer').attr('style', 'display: none');
            $('#user').empty();
            $('#nav-mobile').empty();
            $('#schemes .row').empty();
            break;
        default:
            break;
    }
}

