package gr.ie.istlab;

import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.gdata.util.ServiceException;
import com.google.gson.JsonObject;
import static gr.ie.istlab.GNMConstants.GOOGLE_CREDENTIALS;
import gr.ie.istlab.googleapis.GoogleCalendar;
import gr.ie.istlab.googleapis.GoogleMail;
import gr.ie.istlab.googleapis.GoogleSpreadsheet;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.MessagingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Androklis Gregoriou
 */
public class GNMServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");

        JsonObject json = null;
        String uuid;
        String eventId;
        String calendarId;

        switch (request.getParameter("json[type]")) {
            case "ADD":
                json = new JsonObject();
                uuid = request.getParameter("json[id]");
                eventId = request.getParameter("json[eventId]");
                calendarId = request.getParameter("json[calendarId]");
                json.addProperty("status", "");

                try {
                    if ((!"0".equals(eventId)) && (!"0".equals(calendarId))) {
                        uuid = GoogleSpreadsheet.getInstance().addScheme(calendarId, eventId, "0", request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[eventStart]") + " - " + request.getParameter("json[eventEnd]"), request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
                    } else if (("0".equals(eventId)) && (!"0".equals(calendarId))) {
                        switch (calendarId) {
                            case "8p0n8hong8jbiee7cs7da8h99o@group.calendar.google.com":
                                //mtp calendar
                                URL createURL = new URL("http://mtp-class2014-2015-dot-istlabcalendar.appspot.com/iSTLab_istlabCalendar_servlet?action=createEvent&eventProperties=%7B%22start%22%3A%7B%22dateTime%22%3A%22" + request.getParameter("json[eventStart]").split(" ")[0] + "T" + (request.getParameter("json[eventStart]").split(" ")[1]).replaceAll(":", "%3A") + "%3A00%22%2C%22timeZone%22%3A%22Europe%2FAthens%22%7D%2C%22end%22%3A%7B%22dateTime%22%3A%22" + request.getParameter("json[eventEnd]").split(" ")[0] + "T" + (request.getParameter("json[eventStart]").split(" ")[1]).replaceAll(":", "%3A") + "%3A00%22%2C%22timeZone%22%3A%22Europe%2FAthens%22%7D%2C%22summary%22%3A%22" + request.getParameter("json[subject]").replaceAll(" ", "+") + "%22%2C%22attendees%22%3A%5B%7B%22email%22%3A%22" + request.getParameter("json[user_email]") + "%22%7D%2C%7B%22email%22%3A%22" + request.getParameter("json[contacts]").replaceAll(",", "%22%7D%2C%7B%22email%22%3A%22") + "%22%7D%5D%2C%22status%22%3A%22confirmed%22%2C%22description%22%3A%22" + request.getParameter("json[message]").replaceAll(" ", "+").replaceAll("\\<.*?>", "") + "%22%2C%22location%22%3A%22%22%7D&additionalExtendedProperties=%7B%22eventState%22%3A%22completed%22%2C%22locationMap%22%3A%22%22%2C%22eventAffordances%22%3A%22%7B%5C%22disqus%5C%22%3Atrue%2C%5C%22googleDrive%5C%22%3Atrue%2C%5C%22flickr%5C%22%3Atrue%2C%5C%22youTube%5C%22%3Atrue%2C%5C%22asana%5C%22%3Atrue%2C%5C%22wUnderground%5C%22%3Atrue%2C%5C%22eventTagging%5C%22%3Atrue%2C%5C%22tasks_disqus%5C%22%3Atrue%2C%5C%22tasks_googleDrive%5C%22%3Atrue%2C%5C%22tasks_flickr%5C%22%3Atrue%2C%5C%22tasks_youTube%5C%22%3Atrue%7D%22%7D&googleToken=" + GOOGLE_CREDENTIALS.get(request.getParameter("json[user_email]")).getAccessToken() + "&asanaToken=null&flickrToken=null&flickrTokenSecret=null");
                                HttpURLConnection createConn = (HttpURLConnection) createURL.openConnection();  //connecting to url
                                createConn.setConnectTimeout(0);
                                createConn.setRequestMethod("GET");
                                BufferedReader in = new BufferedReader(new InputStreamReader(createConn.getInputStream()));  //stream to resource
                                String str = in.readLine();
                                in.close();  //closing stream
                                JSONObject jsonObj = new JSONObject(str);

                                eventId = (String) jsonObj.get("id");

                                URL updateURL = new URL("http://mtp-class2014-2015-dot-istlabcalendar.appspot.com/iSTLab_istlabCalendar_servlet?action=updateEvent&eventId=" + eventId + "&eventProperties=%7B%22start%22%3A%7B%22dateTime%22%3A%22" + request.getParameter("json[eventStart]").split(" ")[0] + "T" + (request.getParameter("json[eventStart]").split(" ")[1]).replaceAll(":", "%3A") + "%3A00%22%2C%22timeZone%22%3A%22Europe%2FAthens%22%7D%2C%22end%22%3A%7B%22dateTime%22%3A%22" + request.getParameter("json[eventEnd]").split(" ")[0] + "T" + (request.getParameter("json[eventStart]").split(" ")[1]).replaceAll(":", "%3A") + "%3A00%22%2C%22timeZone%22%3A%22Europe%2FAthens%22%7D%2C%22summary%22%3A%22" + request.getParameter("json[subject]").replaceAll(" ", "+") + "%22%2C%22status%22%3A%22confirmed%22%2C%22description%22%3A%22" + request.getParameter("json[message]").replaceAll(" ", "+").replaceAll("\\<.*?>", "") + "%22%2C%22location%22%3A%22%22%7D&additionalExtendedProperties=%7B%22eventState%22%3A%22completed%22%2C%22locationMap%22%3A%22%22%2C%22eventAffordances%22%3A%22%7B%5C%22disqus%5C%22%3Atrue%2C%5C%22googleDrive%5C%22%3Atrue%2C%5C%22flickr%5C%22%3Atrue%2C%5C%22youTube%5C%22%3Atrue%2C%5C%22asana%5C%22%3Atrue%2C%5C%22wUnderground%5C%22%3Atrue%2C%5C%22eventTagging%5C%22%3Atrue%2C%5C%22tasks_disqus%5C%22%3Atrue%2C%5C%22tasks_googleDrive%5C%22%3Atrue%2C%5C%22tasks_flickr%5C%22%3Atrue%2C%5C%22tasks_youTube%5C%22%3Atrue%7D%22%7D&googleToken=" + GOOGLE_CREDENTIALS.get(request.getParameter("json[user_email]")).getAccessToken() + "&asanaToken=null&flickrToken=null&flickrTokenSecret=null");
                                HttpURLConnection updateConn = (HttpURLConnection) updateURL.openConnection();  //connecting to url
                                updateConn.setConnectTimeout(0);
                                updateConn.setRequestMethod("GET");

                                break;
//                            case "99maciu7cpof4v3v0dsrkt6g1k@group.calendar.google.com":
//                                //on going calendar
//
//                                break;
//                            case "5qf64hr4g5rbhppl9fksjvecm4@group.calendar.google.com":
//                                //onair calendar
//
//                                break;
//                            case "u6bj2l8etihqmgr2vhp1smaei8@group.calendar.google.com":
//                                //publications calendar
//
//                                break;
                            default:
                                eventId = GoogleCalendar.getInstance().addEvent(calendarId, request.getParameter("json[user_email]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[contacts]"), request.getParameter("json[eventStart]"), request.getParameter("json[eventEnd]"), request.getParameter("json[timeZoneOffset]"));
                                break;
                        }
                        uuid = GoogleSpreadsheet.getInstance().addScheme(calendarId, eventId, "1", request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[eventStart]") + " - " + request.getParameter("json[eventEnd]"), request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
                    } else if (("0".equals(eventId)) && ("0".equals(calendarId))) {
                        uuid = GoogleSpreadsheet.getInstance().addScheme(calendarId, eventId, "0", request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), "", request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
                    }
                } catch (MalformedURLException | ServiceException | JSONException ex) {
                    Logger.getLogger(GNMServlet.class.getName()).log(Level.SEVERE, null, ex);
                }

                json.addProperty("id", uuid);
                json.addProperty("calendarId", calendarId);
                json.addProperty("eventId", eventId);

                if ("true".equals(request.getParameter("json[now]"))) {
                    try {
                        json.addProperty("status", GoogleMail.getInstance().sendMessage(
                                GoogleMail.getInstance().createEmail(
                                        request.getParameter("json[user_email]"),
                                        request.getParameter("json[contacts]").split(","),
                                        request.getParameter("json[subject]"),
                                        request.getParameter("json[message]")),
                                request.getParameter("json[user_email]"), uuid));
                    } catch (MessagingException | MalformedURLException | ServiceException ex) {
                        Logger.getLogger(GNMServlet.class.getName()).log(Level.SEVERE, null, ex);
                    }
                } else {
                    json.addProperty("status", "PENDING");
                }

                response.setContentType("application/json");
                response.getWriter().write(json.toString());
                break;
            case "DELETE":
                try {
                    GoogleSpreadsheet.getInstance().deleteScheme(request.getParameter("json[id]"), request.getParameter("json[user_email]"));
                } catch (MalformedURLException | ServiceException ex) {
                    Logger.getLogger(GNMServlet.class.getName()).log(Level.SEVERE, null, ex);
                }
                break;
            case "UPDATE":
                json = new JsonObject();
                uuid = request.getParameter("json[id]");
                eventId = request.getParameter("json[eventId]");
                calendarId = request.getParameter("json[calendarId]");
                json.addProperty("status", "");
                String fromCalendar = "";

                try {
                    switch (request.getParameter("json[owner]")) {
                        case "0":
                            GoogleSpreadsheet.getInstance().editScheme(uuid, calendarId, eventId, request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), "", request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
                            break;
                        case "1":
                            fromCalendar = GoogleSpreadsheet.getInstance().editScheme(uuid, calendarId, eventId, request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[eventStart]") + " - " + request.getParameter("json[eventEnd]"), request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
                            GoogleCalendar.getInstance().updateEvent(fromCalendar, calendarId, request.getParameter("json[eventId]"), request.getParameter("json[user_email]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[contacts]"), request.getParameter("json[eventStart]"), request.getParameter("json[eventEnd]"), request.getParameter("json[timeZoneOffset]"));
                            break;
                        case "2":
                            eventId = GoogleCalendar.getInstance().addEvent(calendarId, request.getParameter("json[user_email]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[contacts]"), request.getParameter("json[eventStart]"), request.getParameter("json[eventEnd]"), request.getParameter("json[timeZoneOffset]"));
                            uuid = GoogleSpreadsheet.getInstance().editScheme(calendarId, eventId, "1", request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), "", request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
                            break;
                        default:
                            break;
                    }
                } catch (MalformedURLException | ServiceException ex) {
                    Logger.getLogger(GNMServlet.class.getName()).log(Level.SEVERE, null, ex);
                }

                json.addProperty("id", uuid);
                json.addProperty("calendarId", calendarId);
                json.addProperty("eventId", eventId);

                if ("true".equals(request.getParameter("json[now]"))) {
                    try {
                        json.addProperty("status", GoogleMail.getInstance().sendMessage(
                                GoogleMail.getInstance().createEmail(
                                        request.getParameter("json[user_email]"),
                                        request.getParameter("json[contacts]").split(","),
                                        request.getParameter("json[subject]"),
                                        request.getParameter("json[message]")),
                                request.getParameter("json[user_email]"), uuid));
                    } catch (MessagingException | MalformedURLException | ServiceException ex) {
                        Logger.getLogger(GNMServlet.class.getName()).log(Level.SEVERE, null, ex);
                    }
                } else {
                    json.addProperty("status", "PENDING");
                }

                response.setContentType("application/json");
                response.getWriter().write(json.toString());

                break;
            case "COPY":
                json = new JsonObject();
                uuid = request.getParameter("json[id]");
                json.addProperty("status", "");

                try {
                    uuid = GoogleSpreadsheet.getInstance().addScheme("0", "0", "0", request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), "", request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
                } catch (MalformedURLException | ServiceException ex) {
                    Logger.getLogger(GNMServlet.class.getName()).log(Level.SEVERE, null, ex);
                }

                json.addProperty("id", uuid);

                if ("true".equals(request.getParameter("json[now]"))) {
                    try {
                        json.addProperty("status", GoogleMail.getInstance().sendMessage(
                                GoogleMail.getInstance().createEmail(
                                        request.getParameter("json[user_email]"),
                                        request.getParameter("json[contacts]").split(","),
                                        request.getParameter("json[subject]"),
                                        request.getParameter("json[message]")),
                                request.getParameter("json[user_email]"), uuid));
                    } catch (MessagingException | MalformedURLException | ServiceException ex) {
                        Logger.getLogger(GNMServlet.class.getName()).log(Level.SEVERE, null, ex);
                    }
                } else {
                    json.addProperty("status", "PENDING");
                }

                response.setContentType("application/json");
                response.getWriter().write(json.toString());
                break;
            default:
                break;
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

}
