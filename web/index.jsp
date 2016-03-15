<%-- 
    Document   : index
    Created on : Mar 11, 2016, 12:55:32 PM
    Author     : Androklis Gregoriou
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>

        <title>Group Notification Mechanism</title>

        <!-- CSS  -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link href="css/materialize.css" type="text/css" rel="stylesheet" media="screen,projection"/>
        <link href="css/materialize.clockpicker.css" type="text/css" rel="stylesheet" media="screen,projection"/>
        <link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>

        <!-- Favicons-->
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
        <link rel="manifest" href="/manifest.json">

        <script src="js/jquery-2.1.1.min.js"></script>
        <script src="js/jquery.validate.js"></script>
        <script src="js/jquery.cookie.js"></script>
        <script src="js/materialize.js"></script>
        <script src="js/materialize.clockpicker.js"></script>
    </head>
    <body>
        <div class="adr_schema col s12 m6 l3" style="display:none;">
            <div class="card hoverable small">
                <div style="padding-top: 5px;">
                    <span id="adr_type" class="badge left">Lorem ipsum</span>
                    <span id="adr_badge" class="badge right">Lorem ipsum</span>
                </div>
                <div class="card-content">
                    <span id="adr_title" class="card-title">Lorem ipsum dolor sit amet</span>
                    <p id="adr_description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <div class="card-action">
                </div>
            </div>
            <input type="hidden" id="rcpts" name="rcpts" value=""/>
        </div>
        <input type="hidden" id="uuid" />
        <div class="fixed-action-btn" style="bottom: 45px; right: 24px; display:none;">
            <a id="addBtn" class="btn-floating btn-large waves-effect waves-light red modal-trigger" href="#addModal">
                <i class="large material-icons">add</i>
            </a>
        </div>

        <div id="viewModal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4 id="viewTitle" style="text-align: center;"></h4>
                <div class="viewContent"></div>
            </div>
            <div class="modal-footer">
                <a href="#!" class=" modal-action modal-close waves-effect btn-flat">Close</a>
            </div>
        </div>

        <div id="deleteModal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4 id="viewTitle" style="text-align: center;">Delete Scheme?</h4>
                <div class="viewContent" style="font-size: 1.5rem;">
                </div>
            </div>
            <div class="modal-footer">
                <strong class="btn-flat left" style="cursor: default;"><font color='red'>THIS PROCEDURE IS IRREVERSIBLE</font></strong>
                <a id="delBtn" class="modal-action modal-close waves-effect btn-flat red-text" onclick="delCard();"> Delete </a>
                <a class="modal-action modal-close waves-effect btn-flat">Cancel</a>
            </div>
        </div>

        <div id="calendarModal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4 style="text-align: center;">Event Settings</h4>
                <div class="row">
                    <p>Event Starts</p>
                    <div class="col s12 m6 l6">
                        <input id="startDate" class="datepicker" type="date">
                    </div>
                    <div class="col s12 m6 l6">
                        <input id="startTime" class="timepicker" type="text">
                    </div>
                </div>
                <div class="row">
                    <p>Event Ends</p>
                    <div class="col s12 m6 l6">
                        <input id="endDate" class="datepicker" type="date">
                    </div>
                    <div class="col s12 m6 l6">
                        <input id="endTime" class="timepicker" type="text">
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
                <h4 style="text-align: center;">Add new Scheme</h4>
                <div class="row input-field">
                    <input type="text" id="autocomplete" class="autocomplete" data-array='[{"value": "example","path": "http://www.sense-lang.org/trial/images/img-test.jpg","class": "left circle"},{"value": "example 2","path": "http://www.sense-lang.org/trial/images/img-test.jpg","class": "right circle"},{"value": "test","path": "http://www.sense-lang.org/trial/images/img-test.jpg","class": "right circle"}]'>
                    <label for="autocomplete">Autocomplete</label>
                </div>
                <div class="row input-field">
                    <select multiple id="contacts" class="icons" name="contacts" required="required">
                        <option value="" disabled selected>Choose contacts</option>
                    </select>
                    <label for="contacts">Google Contacts</label>
                </div>
                <div class="row input-field">
                    <input id="subject" type="text" required="required">
                    <label for="subject">Subject</label>
                </div>
                <div class="row input-field">
                    <div class="col s4 m4 l2">
                        <input type="checkbox" id="now" checked="checked" />
                        <label for="now">now</label>
                    </div>
                    <div class="col s8 m8 l4">
                        <select id="calendars">
                            <option value="0" selected>DO NOT ADD TO CALENDAR</option>
                        </select>
                    </div>
                    <div class="col s6 m6 l3">
                        <input id="date" class="datepicker" type="date">
                    </div>
                    <div class="col s6 m6 l3">
                        <input id="time" class="timepicker" type="text">
                    </div>

                </div>
                <div class="row input-field">
                    <textarea id="message" class="materialize-textarea" required="required"></textarea>
                    <label for="message">Message</label>
                </div>
            </div>
            <div class="modal-footer">
                <a id="eventSettings" class="waves-effect btn-flat left disabled"><i class="material-icons">date_range</i></a>
                <a id="addBtn" href="#!" class="modal-action modal-close waves-effect btn-flat" onclick="addCard();">Add</a>
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
                <div id="welcomeScreen" class="row center" style="display:none;">
                    <br><br>
                    <img id="logo-img" height="100" alt="" src="images/MashUp_Logo-1993x1328.png"/>
                    <br><br>
                    <h5 class="header col s12 light">A mashup web application mechanism to manage group notification schemes</h5><br/><br/><br/><br/>
                    <button id="customBtn" class="waves-effect waves-light btn red">Sign in with Google</button>
                    <br><br>
                </div>
                <div id="schemes" style="display:none;">
                    <form>
                        <div class="input-field">
                            <input id="search" type="search" required>
                            <label for="search"><i class="material-icons">search</i></label>
                        </div>
                    </form>
                    <div class="row">
                    </div>
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
