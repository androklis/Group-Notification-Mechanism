<%-- 
    Document   : rest-api-doc
    Created on : Jun 8, 2016, 7:26:19 PM
    Author     : Androklis Gregoriou
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- Meta -->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
        <!-- Meta -->

        <!-- Title -->
        <title>Group Notification Mechanism</title>
        <!-- Title -->

        <!-- CSS  -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link href="css/materialize.css" type="text/css" rel="stylesheet" media="screen,projection"/>
        <link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>
        <link href="css/doc_style.css" type="text/css" rel="stylesheet" media="screen,projection"/>
        <!-- CSS  -->

        <!-- Favicons -->
        <link rel="apple-touch-icon" sizes="57x57" href="images/favicons/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="images/favicons/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="images/favicons/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="images/favicons/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="images/favicons/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="images/favicons/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="images/favicons/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="images/favicons/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="images/favicons/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="images/favicons/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="images/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="images/favicons/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicons/favicon-16x16.png">
        <!-- Favicons -->

        <!-- Manifest -->
        <link rel="manifest" href="/manifest.json">
        <!-- Manifest -->

        <!-- Scripts -->
        <script src="js/jquery-2.1.1.min.js"></script>
        <script src="js/materialize.js"></script>
        <script src="js/lunr.min.js"></script>
        <script src="js/search.js"></script>
        <!-- Scripts -->
    </head>
    <body>

        <nav class="light-blue lighten-1">
            <div class="nav-wrapper container">
                <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>
                <div class="header">API Documentation | About</div>
                <ul id="nav-mobile" class="side-nav fixed" style="transform: translateX(0%);overflow-x: hidden;">
                    <li class="logo"><a href="documentation.jsp" class="brand-logo">
                            <i class="material-icons">notifications</i></a></li>
                    <li class="search">
                        <div class="search-wrapper card">
                            <input id="search"><i class="material-icons">search</i>
                            <div class="search-results"></div>
                        </div>
                    <li class="bold active"><a class="collapsible-header waves-effect waves-teal" onclick="about();">About</a>
                    <li id="auth" class="bold"><a class="collapsible-header waves-effect waves-teal" onclick="authentication();">Authenticate</a>
                    <li class="no-padding">
                        <ul class="collapsible collapsible-accordion">
                            <li class="bold"><a class="collapsible-header waves-effect waves-teal">Manage Schemes</a>
                                <div class="collapsible-body" style="">
                                    <ul>
                                        <li><a onclick="addSchemeAPI();">Add new scheme</a></li>
                                        <li><a onclick="deleteSchemeAPI();">Delete scheme</a></li>
                                        <li><a onclick="updateSchemeAPI();">Update scheme</a></li>
                                        <li><a onclick="copySchemeAPI();">Copy scheme</a></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="section no-pad-bot" id="index-banner">
            <div class="container">
                <h3>AJAX Requests structure</h3><em><u>One-off Procedure for first time use:</u><br/>Login to <a href="http://group-notification-mechanism.appspot.com" target="_blank">Group Notification Mechanism</a> using the Google account that your service will use and grant access to specified scopes!</em><blockquote>All AJAX requests have the following structure</blockquote><div style="background-color: lightgray;"><code>var <em>JSON_VAR</em> = {<br/><em>JSON_KEY_1</em>: <em>JSON_VALUE_1</em>,<br/><em>JSON_KEY_2</em>: <em>JSON_VALUE_2</em>,<br/>.<br/>.<br/>.<br/>};<br/><br/>$.post("<em>SERVLET_NAME</em>", {json: <em>JSON_VAR</em>}, function (response, statusText, xhr) {<br/>}<br/>});</code></div><br/><em style="color: black;">Before start using the API calls first you should auhenticate user with google and then follow <a onclick="authentication();">these</a> steps.</em>
            </div>
        </div>

        <footer id="footer" class="page-footer  light-blue lighten-1">
            <div class="footer-copyright">
                <div class="container">
                    © <script>document.write(new Date().getFullYear());</script> | Developed by <a class="white-text" href="mailto:androklis.greg@gmail.com">Androklis Gregoriou</a>
                </div>
            </div>
        </footer>

        <!--Scripts-->
        <script src="js/docInit.js"></script>
        <script src="js/doc_actions.js"></script>
    </body>
</html>
