<%-- 
    Document   : index
    Created on : Mar 11, 2016, 12:55:32 PM
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
        <link href="css/materialize.clockpicker.css" type="text/css" rel="stylesheet" media="screen,projection"/>
        <link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>
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
        <script src="js/jquery.cookie.js"></script>
        <script src="js/jquery.autocomplete.js"></script>
        <script src="js/jquery.mixitup.min.js"></script>
        <script src="js/materialize.js"></script>
        <script src="js/materialize.clockpicker.js"></script>
        <!-- Scripts -->
    </head>
    <body>
        <div class="adr_schema col s12 m6 l3 mix" style="display:none;">
            <div class="card hoverable small">
                <div style="padding-top: 5px;">
                    <span id="adr_type" class="badge left">Lorem ipsum</span>
                    <span id="adr_badge" class="badge right truncate">Lorem ipsum</span>
                </div>
                <div class="card-content">
                    <span id="adr_title" class="card-title truncate">Lorem ipsum dolor sit amet</span>
                    <p id="adr_description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <div class="card-action">
                </div>
            </div>
            <input type="hidden" id="rcpts" name="rcpts" value=""/>
            <input type="hidden" id="calendarId" name="calendarID" value=""/>
        </div>
        <input type="hidden" id="uuid" value="0"/>
        <div class="fixed-action-btn" style="bottom: 45px; right: 24px; display:none;">
            <a id="addBtn" class="btn-floating btn-large waves-effect waves-light red modal-trigger" href="#addModal">
                <i class="large material-icons">add</i>
            </a>
        </div>

        <div id="viewModal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4 id="viewTitle" style="text-align: center;"></h4>
                <div class="viewContent">
                    <ul id="attPeople" class="collapsible" data-collapsible="expandable">
                        <li>
                            <div class="collapsible-header">
                                <i class="material-icons">cast</i>
                                Resource<span id="rsc" class="badge right" style="position: inherit;"></span>
                            </div>
                            <div class="collapsible-body">
                                <p class="resource"></p>
                            </div>
                        </li>
                        <li>
                            <div class="collapsible-header">
                                <i class="material-icons">date_range</i>
                                Timestamp
                            </div>
                            <div class="collapsible-body">
                                <p class="dateRange"></p>
                            </div>
                        </li>
                        <li>
                            <div class="collapsible-header">
                                <i class="material-icons">description</i>
                                Description
                            </div>
                            <div class="collapsible-body">
                                <div class="desc"></div>
                            </div>
                        </li>
                        <li>
                            <div class="collapsible-header">
                                <i class="material-icons">contacts</i>
                                Attendees<span id="attendeesCnt" class="badge right" style="position: inherit;"></span>
                            </div>
                            <div class="collapsible-body">
                                <div class="attendees">
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <a class="waves-effect btn left" onClick="expandAll();"><i class="material-icons left">fullscreen</i>Expand All</a>
                <a class="waves-effect btn left" onClick="collapseAll();" style="margin-left: 5px;"><i class="material-icons left">fullscreen_exit</i>Collapse All</a>
                <a href="#!" class=" modal-action modal-close waves-effect btn-flat">Close</a>
            </div>
        </div>

        <!-- Settings Modal Structure -->
        <div id="settingsModal" class="modal bottom-sheet">
            <div class="modal-content">
                <h4>Group Notification Mechanism Settings</h4>
                <div class="row">
                    <div class="col s12 m6 l6">
                        <label for="suggestionsSwitch">Suggestions</label>
                        <div id="suggestionsSwitch" class="switch">
                            <label>
                                Off
                                <input type="checkbox" id="suggChk" checked>
                                <span class="lever"></span>
                                On
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a class="modal-action modal-close waves-effect btn-flat" onclick="saveSettings();">Save</a>
                <a class="modal-action modal-close waves-effect btn-flat">Cancel</a>
            </div>
        </div>

        <div id="deleteModal" class="modal bottom-sheet">
            <div class="modal-content">
                <h4 id="viewTitle" style="text-align: center;">Delete Scheme?</h4>
                <div class="viewContent">
                </div>
            </div>
            <div class="modal-footer">
                <em><strong class="btn-flat left red-text" style="cursor: initial;">THIS PROCEDURE IS IRREVERSIBLE</strong></em>
                <a id="delBtn" class="modal-action modal-close waves-effect btn-flat red-text" onclick="delCard();"> Delete </a>
                <a class="modal-action modal-close waves-effect btn-flat">Cancel</a>
            </div>
        </div>

        <div id="calendarModal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4 style="text-align: center;">Event Settings</h4>
                <div class="row">
                    <div class="col s12 m6 l6">
                        <label for="startDate">Start Date</label>
                        <input id="startDate" class="datepicker" type="date">
                    </div>
                    <div class="col s12 m6 l6">
                        <label for="startTime">Start Time</label>
                        <input id="startTime" class="timepicker" type="text">
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m6 l6">
                        <label for="endDate">End Date</label>
                        <input id="endDate" class="datepicker" type="date">
                    </div>
                    <div class="col s12 m6 l6">
                        <label for="endTime">End Time</label>
                        <input id="endTime" class="timepicker" type="text">
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m6 l6">
                        <label for="mapSwitch">Location</label>
                        <div id="mapSwitch" class="switch">
                            <label>
                                Off
                                <input type="checkbox">
                                <span class="lever"></span>
                                On
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a class="modal-action modal-close waves-effect btn-flat" onclick=""> Save </a>
                <a class="modal-action modal-close waves-effect btn-flat">Cancel</a>
            </div>
        </div>

        <div id="copyModal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4 id="viewTitle" style="text-align: center;">Repeat Scheme</h4>
                <div class="viewContent" style="font-size: 1.5rem;">
                </div>
                <form id="deleteForm" class="col s12" action="GNMServlet" method="POST">
                    <!--                    <div class="row input-field">
                                            <div class="col s4 m4 l2">
                                                <input type="checkbox" id="now" checked="checked" />
                                                <label for="now">now</label>
                                            </div>
                    
                                            <div class="col s8 m8 l4">
                                                <select id="calendars">
                                                    <option value="0" selected>Do not add to calendar</option>
                                                </select>
                                            </div>
                    
                                            <div class="col s6 m6 l3">
                                                <input id="date" class="datepicker" type="date">
                                            </div>
                    
                                            <div class="col s6 m6 l3">
                                                <input id="time" class="timepicker" type="text">
                                            </div>
                    
                                        </div>-->

                </form>
            </div>
            <div class="modal-footer">
                <strong class="btn-flat left" style="cursor: default;"><font color='red'>THIS PROCEDURE IS IRREVERSIBLE</font></strong>
                <a id="delBtn" class="modal-action modal-close waves-effect btn-flat red-text" onclick="$('#deleteForm').submit();"> Delete </a>
                <a id="delBtnCax" class="modal-action modal-close waves-effect btn-flat">Cancel</a>
            </div>
        </div>

        <div id="addModal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4 id="schemeTitle" style="text-align: center;">Add new Scheme</h4>
                <input type="hidden" id="eventId" name="eventID" value="0"/>
                <form id="addForm"> 
                    <div class="row input-field">
                        <div class="contactsList"></div>
                    </div>
                    <div class="row input-field">
                        <div class="ui-widget">
                            <input id="contacts" name="contacts" type="text" required="required">
                            <label for="contacts">Choose contacts</label>
                            <div class="error con" style="display: none;">
                                <label>Select at least one contact</label>
                            </div>
                        </div>
                    </div>
                    <div class="row input-field">
                        <input id="subject" name="subject" type="text">
                        <label for="subject">Subject</label>
                        <div class="error sub" style="display: none;">
                            <label>Enter a Subject</label>
                        </div>
                    </div>
                    <div class="row input-field">
                        <div class="col s4 m4 l2">
                            <input type="checkbox" id="now" checked="checked" />
                            <label for="now">now</label>
                        </div>
                        <div class="col s8 m8 l4" style="position: relative;">
                            <select id="calendars">
                                <option value="0" selected>DO NOT ADD TO CALENDAR</option>
                            </select>
                            <label for="calendars">Calendars</label>
                        </div>
                        <div class="col s6 m6 l3" style="position: relative;">
                            <input id="date" class="datepicker" type="date">
                            <label for="date">Date</label>
                        </div>
                        <div class="col s6 m6 l3" style="position: relative;">
                            <input id="time" class="timepicker" type="text">
                            <label for="time">Time</label>
                        </div>
                    </div>
                    <div class="row input-field">
                        <textarea id="message" name="message" class="materialize-textarea" length="500" required="required"></textarea>
                        <label for="message">Message</label>
                        <div class="error msg" style="display: none;">
                            <label>Enter a Message</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <a id="eventSettings" class="waves-effect btn-flat left disabled"><i class="material-icons">date_range</i></a>
                <a id="addBtn" href="#!" class="waves-effect btn-flat" onclick="addCard();">Add</a>
            </div>
        </div>

        <nav class="light-blue lighten-1">
            <div class="nav-wrapper container">
                <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>
                <a href="#!" class="brand-logo">GNM</a>
                <ul id="user" class="right hide-on-med-and-down">
                </ul>
                <ul class="side-nav" id="nav-mobile">
                </ul>

            </div>
        </nav>
        <div class="progress" style="display: none;">
            <div class="indeterminate"></div>
        </div>
        <div class="section no-pad-bot" id="index-banner">
            <div class="container">
                <div id="schemes" style="display:none;">
                    <form>
                        <div class="input-field">
                            <input id="search" type="search" required>
                            <label for="search"><i class="material-icons">search</i></label>
                        </div>
                        <div class="row">
                            <div class="col s12 m4 l4">
                                <div class="row">
                                    <label for="">Filter:</label>
                                    <div class="chip waves-effect filter" data-filter="all" onclick="toggleSuggestions();">All</div>
                                    <div class="chip waves-effect filter" data-filter=".suggestion" onclick="toggleSuggestions();">Suggestions</div>
                                    <div class="chip waves-effect filter" data-filter=".scheme">Schemes</div>
                                    <div class="chip waves-effect filter" data-filter=".pending">Pending</div>
                                    <div class="chip waves-effect filter" data-filter=".sent">Sent</div>
                                </div>
                                <div class="row">
                                    <label for="">Sort:</label>
                                    <div class="chip waves-effect sort" data-sort="timestamp:asc">Ascending</div>
                                    <div class="chip waves-effect sort" data-sort="timestamp:desc">Descending</div>
                                </div>
                            </div>
                            <div id="paginationDiv" class="col s12 m4 l4 right">
<!--                                <ul class="pagination">
                                    <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                                    <li class="active"><a href="#!">1</a></li>
                                    <li class="waves-effect"><a href="#!">2</a></li>
                                    <li class="waves-effect"><a href="#!">3</a></li>
                                    <li class="waves-effect"><a href="#!">4</a></li>
                                    <li class="waves-effect"><a href="#!">5</a></li>
                                    <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
                                </ul>-->
                            </div>  
                        </div>
                    </form>
                    <div id="schemesContainer" class="row">
                    </div>
                </div>

                <div id="welcomeScreen" class="center" style="display:none;">
                    <br><br>
                    <img id="logo-img" class="responsive-img" height="100" alt="" src="images/MashUp_Logo-1993x1328.png"/>
                    <br><br>
                    <h5 class="header light">A mashup web application mechanism to manage group notification schemes</h5><br/><br/><br/><br/>
                    <button id="customBtn" class="waves-effect waves-light btn red">Sign in with Google</button>
                    <br><br>
                </div>

                <div id="spinnerContainer" class="row center" style="display:none;">
                    <div class="preloader-wrapper big active">
                        <div class="spinner-layer spinner-blue">
                            <div class="circle-clipper left">
                                <div class="circle"></div>
                            </div><div class="gap-patch">
                                <div class="circle"></div>
                            </div><div class="circle-clipper right">
                                <div class="circle"></div>
                            </div>
                        </div>

                        <div class="spinner-layer spinner-red">
                            <div class="circle-clipper left">
                                <div class="circle"></div>
                            </div><div class="gap-patch">
                                <div class="circle"></div>
                            </div><div class="circle-clipper right">
                                <div class="circle"></div>
                            </div>
                        </div>

                        <div class="spinner-layer spinner-yellow">
                            <div class="circle-clipper left">
                                <div class="circle"></div>
                            </div><div class="gap-patch">
                                <div class="circle"></div>
                            </div><div class="circle-clipper right">
                                <div class="circle"></div>
                            </div>
                        </div>

                        <div class="spinner-layer spinner-green">
                            <div class="circle-clipper left">
                                <div class="circle"></div>
                            </div><div class="gap-patch">
                                <div class="circle"></div>
                            </div><div class="circle-clipper right">
                                <div class="circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer id="footer" class="page-footer  light-blue lighten-1">
            <div class="footer-copyright">
                <div class="container">
                    © <script>document.write(new Date().getFullYear());</script> Group Notification Mechanism | Developed by <a class="white-text" href="mailto:androklis.greg@gmail.com">Androklis Gregoriou</a>
                </div>
            </div>
        </footer>

        <!--  Scripts-->
        <script src="js/oauth.js"></script>
        <script src="js/init.js"></script>
        <script src="js/google.contacts-v3.js"></script>
        <script src="js/google.calendar-v3.js"></script>
        <script src="js/modal-actions.js"></script>
    </body>
</html>
