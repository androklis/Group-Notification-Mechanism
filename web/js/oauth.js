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

            $.cookie("access_token", authResult['access_token'], {
                expires: 1
            });

            togglePage('signedIn');
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

            $.cookie("email", response.emails[0].value, {
                expires: 1
            });

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

            $('#user').append('<li><a href="http://master-thesis-954.appspot.com/topics.jsp" class="waves-effect waves-light" target="_blank">iSTLab Content Aggregator</a></li>');
            $('#user').append('<li><a href="http://1-dot-ktistak-calendar-md.appspot.com/" class="waves-effect waves-light" target="_blank">iSTLab Calendar</a></li>');
//            $('#user').append('<li><a href="/rest-api-doc.jsp" class="waves-effect waves-light" target="_blank">Documentation</a></li>');
            $('#user').append('<li><a href="https://docs.google.com/forms/d/1QfU866lVuo4G6UMHDE5hknfMF325fHtK_3MfCeIsmMI/viewform" class="waves-effect waves-light" target="_blank">Report a bug</a></li>');

            $('#user').append('<li> <div id="user_infoContainer" class="user-wrapper" style="display: block;"> <div class="user-links-wrapper"> <div class="user-links-row"> <a class="user-link" href="https://myaccount.google.com/" target="_blank">' + $.cookie("email") + '</a> </div> <div class="user-links-row"> <a class="user-change user-link" href="https://www.google.com/accounts/Logout?continue=https://accounts.google.com/AccountChooser?continue=https://appengine.google.com/_ah/logout?continue=http://group-notification-mechanism.appspot.com/"> Change account </a> <span class="user-link user-pipe">|</span> <a class="user-signout user-link" href="https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://group-notification-mechanism.appspot.com/"> Sign out </a> </div> </div> <a href="https://myaccount.google.com/" class="userAvatar"> <img src="' + img + '" class="avatar"> </a> </div> </li>');
//            $('#nav-mobile').append('<li style="text-align: center;"><a href="https://myaccount.google.com/" target="_blank"><img alt="" src="' + img + '" style="vertical-align: middle; border-radius: 25px; width:50px; height:50px;"/></a></li><li style="color: black; text-align: center;"><a href="https://myaccount.google.com/" target="_blank"><strong>' + name + '</strong></a></li><li><a style="color: black; text-align: center;" href="https://www.google.com/accounts/Logout?continue=https://accounts.google.com/AccountChooser?continue=https://appengine.google.com/_ah/logout?continue=http://group-notification-mechanism.appspot.com/"> Change account </a></li><li style="text-align: center;"><a href="#!" class="waves-effect waves-light light-blue-text" onclick="signOut();">Sign Out</a></li><li><a href="https://docs.google.com/forms/d/1QfU866lVuo4G6UMHDE5hknfMF325fHtK_3MfCeIsmMI/viewform" class="waves-effect waves-light" target="_blank">Report a bug</a></li><li><a href="/rest-api-doc.jsp" class="waves-effect waves-light" target="_blank">Documentation</a></li><li><a href="http://master-thesis-954.appspot.com/topics.jsp" class="waves-effect waves-light" target="_blank">iSTLab Content Aggregator</a></li><li><a href="http://1-dot-ktistak-calendar-md.appspot.com/" class="waves-effect waves-light" target="_blank">iSTLab Calendar</a></li>');
            $('#nav-mobile').append('<li style="text-align: center;"><a href="https://myaccount.google.com/" target="_blank"><img alt="" src="' + img + '" style="vertical-align: middle; border-radius: 25px; width:50px; height:50px;"/></a></li><li style="color: black; text-align: center;"><a href="https://myaccount.google.com/" target="_blank"><strong>' + name + '</strong></a></li><li><a style="color: black; text-align: center;" href="https://www.google.com/accounts/Logout?continue=https://accounts.google.com/AccountChooser?continue=https://appengine.google.com/_ah/logout?continue=http://group-notification-mechanism.appspot.com/"> Change account </a></li><li style="text-align: center;"><a href="#!" class="waves-effect waves-light light-blue-text" onclick="signOut();">Sign Out</a></li><li><a href="https://docs.google.com/forms/d/1QfU866lVuo4G6UMHDE5hknfMF325fHtK_3MfCeIsmMI/viewform" class="waves-effect waves-light" target="_blank">Report a bug</a></li><li><a href="http://master-thesis-954.appspot.com/topics.jsp" class="waves-effect waves-light" target="_blank">iSTLab Content Aggregator</a></li><li><a href="http://1-dot-ktistak-calendar-md.appspot.com/" class="waves-effect waves-light" target="_blank">iSTLab Calendar</a></li>');

            servletCall(code);
        });
    });
}

function servletCall(code) {

    var json = {
        auth_code: code,
        user_email: $.cookie("email")
    };

    $.post("Auth2Servlet", {json: json}, function (response, statusText, xhr) {
        if (xhr.status === 200) {
            loadCards(response.schemes);
            $('#spinnerContainer').attr('style', 'display: none');
            $('.fixed-action-btn').attr('style', 'display: block');
            $('#schemes').attr('style', 'display: block');
        }
    });
}

function signOut() {

    document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://group-notification-mechanism.appspot.com/";

    $.removeCookie("email");
    $.removeCookie("access_token");
    $('.button-collapse').sideNav('hide');
    togglePage('signedOut');
}

function togglePage(status) {
    switch (status) {
        case "signedIn":
            $('#welcomeScreen').attr('style', 'display: none');
            $('#spinnerContainer').attr('style', 'display: block');
            $('#user').attr('style', 'display: block');
            break;
        case "signedOut":
            $('#welcomeScreen').attr('style', 'display: block');
            $('#schemes').attr('style', 'display: none');
            $('#user').attr('style', 'display: none');
            $('.fixed-action-btn').attr('style', 'display: none');
            $('#spinnerContainer').attr('style', 'display: none');
            $('#user').empty();
            $('#nav-mobile').empty();
            $('#schemesContainer.row').empty();
            break;
        default:
            break;
    }
}

