package gr.ie.istlab;

import static gr.ie.istlab.GNMConstants.SERVICE_GOOGLE_CREDENTIAL;
import static gr.ie.istlab.GNMConstants.GOOGLE_CREDENTIALS;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.CredentialRefreshListener;
import com.google.api.client.auth.oauth2.TokenErrorResponse;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.gdata.util.ServiceException;
import com.google.gson.JsonObject;
import static gr.ie.istlab.GNMConstants.REFRESH_TOKENS;

import gr.ie.istlab.googleapis.GoogleSpreadsheet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//import java.sql.Connection;
//import java.sql.DriverManager;
//import java.sql.ResultSet;
//import java.sql.SQLException;
//import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Androklis Gregoriou
 */
public class Auth2Servlet extends HttpServlet {

    private JsonObject json;

//    private Connection con = null;
//    private Statement st = null;
//    private ResultSet rs = null;
//    private final String url = "jdbc:postgresql://db12.grserver.gr/gnm_social_circle_db";
//    private final String user = "androklis_root";
//    private final String password = "!#/bin/2106/";
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
        response.setCharacterEncoding("UTF-8");
        json = null;
        try {
            json = new JsonObject();

            GOOGLE_CREDENTIALS.put(request.getParameter("json[user_email]"), getGoogleCredential(request.getParameter("json[auth_code]")));

            if (!REFRESH_TOKENS.containsKey(request.getParameter("json[user_email]"))) {
                REFRESH_TOKENS.put(request.getParameter("json[user_email]"), GOOGLE_CREDENTIALS.get(request.getParameter("json[user_email]")).getRefreshToken());
            }

            if (GoogleSpreadsheet.getInstance().getWorksheet(request.getParameter("json[user_email]")) == null) {
                GoogleSpreadsheet.getInstance().addWorksheet(request.getParameter("json[user_email]"));
            }
            json.add("schemes", GoogleSpreadsheet.getInstance().getSchemes(request.getParameter("json[user_email]")));

//            con = DriverManager.getConnection(url, user, password);
//            st = con.createStatement();
//            rs = st.executeQuery("SELECT VERSION()");
//
//            if (rs.next()) {
//                System.out.println(rs.getString(1));
//            }
            response.setContentType("application/json");
            response.getWriter().write(json.toString());
        } catch (MalformedURLException | ServiceException ex) {
            Logger.getLogger(Auth2Servlet.class.getName()).log(Level.SEVERE, null, ex);
        }
//        finally {
//            try {
//                if (rs != null) {
//                    rs.close();
//                }
//                if (st != null) {
//                    st.close();
//                }
//                if (con != null) {
//                    con.close();
//                }
//
//            } catch (SQLException ex) {
//                Logger.getLogger(Auth2Servlet.class.getName()).log(Level.SEVERE, null, ex);
//            }
//        }
    }

    @Override
    public void destroy() {
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

    @Override
    public void init() throws ServletException {
        try {
            SERVICE_GOOGLE_CREDENTIAL = new GoogleCredential.Builder()
                    .setTransport(new NetHttpTransport())
                    .setJsonFactory(JacksonFactory.getDefaultInstance())
                    .setServiceAccountId(
                            "gmail-service-account@group-notification-mechanism.iam.gserviceaccount.com")
                    .setServiceAccountScopes(
                            Arrays.asList("https://spreadsheets.google.com/feeds"))
                    .setServiceAccountPrivateKeyFromP12File(
                            new File(Auth2Servlet.class
                                    .getResource("GNM_GMail_SA-key.p12").getPath().replace("%20", " ").trim())).build();
            SERVICE_GOOGLE_CREDENTIAL.refreshToken();

        } catch (GeneralSecurityException | IOException ex) {
            Logger.getLogger(Auth2Servlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private GoogleCredential getGoogleCredential(String authCode) {

        GoogleCredential credential = null;
        NetHttpTransport netHttpTransport = new NetHttpTransport();
        JacksonFactory jacksonFactory = JacksonFactory.getDefaultInstance();

        try {

            GoogleClientSecrets clientSecrets
                    = GoogleClientSecrets.load(
                            JacksonFactory.getDefaultInstance(), new InputStreamReader(new FileInputStream(
                                    new File("WEB-INF/GNM-client_secrets.json"))));

            GoogleAuthorizationCodeFlow authorizationFlow = new GoogleAuthorizationCodeFlow.Builder(
                    netHttpTransport,
                    jacksonFactory,
                    clientSecrets.getDetails().getClientId(),
                    clientSecrets.getDetails().getClientSecret(),
                    Arrays.asList("https://mail.google.com/", "https://www.googleapis.com/auth/calendar"))
                    .setApprovalPrompt("force").setAccessType("offline").build();

            GoogleAuthorizationCodeTokenRequest tokenRequest = authorizationFlow
                    .newTokenRequest(authCode);
            tokenRequest.setRedirectUri("postmessage");
            GoogleTokenResponse tokenResponse = tokenRequest.execute();

            credential = new GoogleCredential.Builder()
                    .setTransport(netHttpTransport).setJsonFactory(jacksonFactory)
                    .setClientSecrets(clientSecrets.getDetails().getClientId(), clientSecrets.getDetails().getClientSecret())
                    .addRefreshListener(new CredentialRefreshListener() {
                        @Override
                        public void onTokenErrorResponse(Credential credential,
                                TokenErrorResponse tokenErrorResponse)
                                throws IOException {

                        }

                        @Override
                        public void onTokenResponse(Credential credential,
                                TokenResponse tokenResponse) throws IOException {

                        }
                    }).build();

            credential.setFromTokenResponse(tokenResponse);

        } catch (IOException ex) {
            Logger.getLogger(Auth2Servlet.class.getName()).log(Level.SEVERE, null, ex);
        }
        return credential;
    }
}
