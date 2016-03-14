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

        switch (request.getParameter("json[type]")) {
            case "ADD":
                JsonObject json = new JsonObject();
                String id = request.getParameter("json[id]");
                String uuid = null;

                json.addProperty("status", "");

                if (("0".equals(request.getParameter("json[id]"))) && (!"0".equals(request.getParameter("json[calendars]")))) {
                    id = GoogleCalendar.getInstance().addEvent(request.getParameter("json[calendars]"), request.getParameter("json[user_email]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[contacts]"), "2016-03-22 15:30", "2016-03-25 15:30");
                }

                try {
                    uuid = GoogleSpreadsheet.getInstance().addScheme(id, request.getParameter("json[user_email]"), request.getParameter("json[contacts]"), request.getParameter("json[subject]"), request.getParameter("json[message]"), request.getParameter("json[date]") + " " + request.getParameter("json[time]"));
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
            case "DELETE":
                try {
                    GoogleSpreadsheet.getInstance().deleteScheme(request.getParameter("json[id]"), request.getParameter("json[user_email]"));
                } catch (MalformedURLException | ServiceException ex) {
                    Logger.getLogger(GNMServlet.class.getName()).log(Level.SEVERE, null, ex);
                }
                break;
            case "COPY":
                break;
            default:
                break;
        }
//        response.sendRedirect("index.jsp");
//        response.setHeader("REFRESH", "0");
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
