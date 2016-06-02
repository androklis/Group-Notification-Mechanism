package gr.ie.istlab;

import com.google.gdata.util.ServiceException;
import com.google.gson.JsonObject;
import gr.ie.istlab.googleapis.GoogleCalendar;
import gr.ie.istlab.googleapis.GoogleMail;
import gr.ie.istlab.googleapis.GoogleSpreadsheet;
import java.io.IOException;
import java.net.MalformedURLException;
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
                        eventId = GoogleCalendar.getInstance().addEvent(calendarId, request.getParameter("json[user_email]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[contacts]"), request.getParameter("json[eventStart]"), request.getParameter("json[eventEnd]"), request.getParameter("json[timeZoneOffset]"));
                        uuid = GoogleSpreadsheet.getInstance().addScheme(calendarId, eventId, "1", request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[eventStart]") + " - " + request.getParameter("json[eventEnd]"), request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
                    } else if (("0".equals(eventId)) && ("0".equals(calendarId))) {
                        uuid = GoogleSpreadsheet.getInstance().addScheme(calendarId, eventId, "0", request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), "", request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
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

    @Override
    public void init() throws ServletException {

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

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return getClass().getName();
    }

}
